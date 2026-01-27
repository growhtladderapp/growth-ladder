
import { GoogleGenAI, Type } from "@google/genai";
import { MuscleGroup, Routine, UserGoal, MuscleGuide, UserBiometrics, FoodAnalysis, Sport, SportGuide, UserProfile, WeeklyGoalOption } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const cleanJson = (text: string): string => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const translateUI = async (targetLanguage: string, currentKeys: Record<string, string>): Promise<Record<string, string>> => {
  try {
    const prompt = `
      Actúa como un experto en localización de software deportivo. 
      Traduce el siguiente objeto JSON de etiquetas de interfaz al idioma: "${targetLanguage}".
      
      REGLAS:
      1. Mantén las claves intactas.
      2. Traduce los valores manteniendo un tono motivador, profesional y de fitness de élite.
      3. No cambies nombres de marca como "Growth Ladder".
      4. Devuelve UNICAMENTE el objeto JSON traducido.
      
      OBJETO A TRADUCIR:
      ${JSON.stringify(currentKeys, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(cleanJson(response.text));
  } catch (error) {
    console.error("Translation error:", error);
    return currentKeys;
  }
};

export const createCoachSession = (userProfile: UserProfile | null) => {
  const profileContext = userProfile
    ? `CONTEXTO FISIOLÓGICO DEL ATLETA: Género: ${userProfile.gender || 'No especificado'}, Edad ${userProfile.age}, Masa Corporal ${userProfile.weight}kg, Estatura ${userProfile.height}cm, Nivel de Experiencia: ${userProfile.experience}, Objetivo Primario: ${userProfile.focus}.`
    : "Perfil fisiológico del atleta no definido.";

  return ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: `
        Eres el 'Director de Rendimiento de Growth Ladder', un experto en ciencias del deporte, biomecánica y nutrición clínica de nivel olímpico.
        - Completamente profesional, clínico y analítico.
        - Basado en evidencia científica.
        - Directo, serio y enfocado en la optimización del rendimiento humano.
        - ${profileContext}
        Responde siempre en el idioma que el usuario utilice.
      `,
    },
  });
};

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysis> => {
  try {
    const cleanBase64 = base64Image.split(',')[1] || base64Image;
    const prompt = `Analiza esta comida. Devuelve JSON con foodName, calories, protein, carbs, fat, confidence.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(cleanJson(response.text)) as FoodAnalysis;
  } catch (error) {
    return { foodName: "Error", calories: 0, protein: 0, carbs: 0, fat: 0, confidence: "Low" };
  }
};

export const generatePersonalizedRoutine = async (goal: UserGoal, biometrics: UserBiometrics, muscleFocus: MuscleGroup | MuscleGroup[]): Promise<Routine> => {
  try {
    const focusLabel = Array.isArray(muscleFocus) ? muscleFocus.join(", ") : muscleFocus;
    const prompt = `
      Actúa como un entrenador de ÉLITE OLÍMPICA. Crea una rutina de entrenamiento de ALTO RENDIMIENTO.
      ATLETA: Nivel ${goal.experience}, Meta: ${goal.focus}.
      ENFOQUE HOY: ${focusLabel}.
      BIOMETRÍA: Peso ${biometrics.weight}kg, Altura ${biometrics.height}cm, Edad ${biometrics.age}.
      
      REGLAS:
      1. Los ejercicios deben ser biomecánicamente eficientes.
      2. Incluye notas técnicas sobre cadencia o respiración.
      3. Estima una duración realista.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título motivador y técnico de la rutina" },
            description: { type: Type.STRING, description: "Breve resumen del objetivo de hoy" },
            estimatedDuration: { type: Type.STRING, description: "Tiempo total (ej: 45-60 min)" },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.STRING, description: "Número de series (ej: 4)" },
                  reps: { type: Type.STRING, description: "Rango de repeticiones (ej: 8-12)" },
                  rest: { type: Type.STRING, description: "Descanso (ej: 90s)" },
                  notes: { type: Type.STRING, description: "Tips técnicos cruciales" }
                },
                required: ["name", "sets", "reps", "rest", "notes"]
              }
            }
          },
          required: ["title", "description", "estimatedDuration", "exercises"]
        }
      }
    });

    return JSON.parse(cleanJson(response.text)) as Routine;
  } catch (error) {
    console.error("Error generating routine:", error);
    // Fallback de emergencia por si falla la API
    return {
      title: "Protocolo de Emergencia",
      description: "Error de sincronización con la IA. Usa esta rutina base.",
      estimatedDuration: "45 min",
      exercises: [
        { name: "Sentadillas Globales", sets: "4", reps: "12", rest: "60s", notes: "Mantén el core activado." },
        { name: "Flexiones de Brazos", sets: "4", reps: "al fallo técnico", rest: "60s", notes: "Controla la fase excéntrica." },
        { name: "Plancha Abdominal", sets: "3", reps: "45s", rest: "30s", notes: "Línea recta desde cabeza a talones." }
      ]
    };
  }
};

export const getMuscleGuide = async (muscle: MuscleGroup, userProfile?: UserProfile | null, currentGoal?: WeeklyGoalOption, environment: 'home' | 'gym' = 'gym'): Promise<MuscleGuide> => {
  try {
    const goalContext = currentGoal
      ? `META USUARIO: ${currentGoal.title} (${currentGoal.type}). ENFOQUE: ${currentGoal.description}.`
      : "";
    const profileContext = userProfile
      ? `ATLETA: Nivel ${userProfile.experience}, Objetivo: ${userProfile.focus}.`
      : "";

    const envContext = environment === 'home'
      ? "ENTORNO: CASA (SIN EQUIPAMIENTO: SOLO PESO CORPORAL / CALISTENIA). No asumir que tiene bandas ni mancuernas."
      : "ENTORNO: GIMNASIO (Acceso total a máquinas, barras, poleas y peso libre).";

    const prompt = `
      Eres un experto en biomecánica. Crea una GUÍA TÉCNICA para: ${muscle}.
      ${goalContext}
      ${profileContext}
      ${envContext}

      ADAPTA LOS EJERCICIOS A LA META Y AL ENTORNO DEL USUARIO:
      - Si es CASA: Usa EXCLUSIVAMENTE ejercicios con peso corporal. Prohibido incluir ejercicios que requieran mancuernas, barras, bandas elásticas o máquinas. Solo calistenia pura y uso de muebles básicos (silla, pared).
      - Si es GIMNASIO: Aprovecha máquinas y equipamiento compuesto.
      - Si es "Quema Calórica/Cardio": Enfócate en altas repeticiones, superseries o ejercicios compuestos.
      - Si es "Fuerza/Músculo": Enfócate en aislamiento y control.
      - Si es "Runner/Distancia": Enfócate en estabilidad y resistencia muscular.

      RETORNA JSON:
      {
        "muscle": "${muscle}",
        "introduction": "Breve análisis biomecánico adaptado a la meta y entorno (${environment}).",
        "exercises": [
          { 
            "name": "Nombre Ejercicio",
            "difficulty": "Principiante/Intermedio/Avanzado",
            "instructions": ["Paso 1", "Paso 2"],
            "commonError": "Error común a evitar",
            "gifUrl": "URL opcional" 
          }
        ]
      }
      (Mínimo 4 ejercicios).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(cleanJson(response.text)) as MuscleGuide;
  } catch (error) {
    console.error("Error generating muscle guide", error);
    // Fallback static data if AI fails
    return {
      muscle,
      introduction: "Guía básica de entrenamiento.",
      exercises: [
        { name: "Ejercicio General 1", difficulty: "Principiante", instructions: ["Realizar movimiento controlado"], commonError: "Mala postura" },
        { name: "Ejercicio General 2", difficulty: "Intermedio", instructions: ["Mantener tensión"], commonError: "Impulso excesivo" }
      ]
    };
  }
};

export const getSportGuide = async (sport: string, userProfile?: UserProfile | null, currentGoal?: WeeklyGoalOption, environment: 'home' | 'gym' = 'gym'): Promise<SportGuide> => {
  try {
    const goalContext = currentGoal
      ? `META USUARIO: ${currentGoal.title}.`
      : "";

    const envContext = environment === 'home'
      ? "ENTORNO: CASA (SIN EQUIPAMIENTO: SOLO PESO CORPORAL). No asumir equipamiento deportivo."
      : "ENTORNO: GIMNASIO (Full equipment).";

    const prompt = `
      Crea una guía de acondicionamiento físico para el deporte: ${sport}.
      ${goalContext}
      ${envContext}
      Adaptado para mejorar el rendimiento en este deporte específico alineado con la meta y entorno del usuario.
      
      RETORNA JSON:
      {
        "sport": "${sport}",
        "focus": "Enfoque principal",
        "introduction": "Intro estratégica adaptada a ${environment}.",
        "exercises": [ (mismo formato que muscle guide) ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(cleanJson(response.text)) as SportGuide;
  } catch (error) {
    return {
      sport,
      focus: "Acondicionamiento General",
      introduction: "No se pudo conectar con la IA (Verifica tu API Key). Mostrando rutina base de mantenimiento.",
      exercises: [
        {
          name: "Burpees",
          difficulty: "Intermedio",
          instructions: ["Desde pie, baja a plancha", "Haz una flexión", "Sube y salta"],
          commonError: "Arquear la espalda",
          gifUrl: "https://media.giphy.com/media/23hPCOCCKgDss/giphy.gif" // Generic placeholder or valid URL if available
        },
        {
          name: "Saltos al Cajón",
          difficulty: "Avanzado",
          instructions: ["Salta con ambos pies", "Aterriza suave", "Extiende cadera arriba"],
          commonError: "Aterrizar con rodillas rígidas"
        },
        {
          name: "Sprint Intervalos",
          difficulty: "Avanzado",
          instructions: ["Corre al 90% por 30s", "Descansa 30s", "Repite"],
          commonError: "Mala técnica de carrera"
        }
      ]
    };
  }
};
