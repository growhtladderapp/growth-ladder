
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
      3. No cambies nombres de marca como "TrainingWithHabits".
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
    ? `CONTEXTO FISIOL�GICO DEL ATLETA: Género: ${userProfile.gender || 'No especificado'}, Edad ${userProfile.age}, Masa Corporal ${userProfile.weight}kg, Estatura ${userProfile.height}cm, Nivel de Experiencia: ${userProfile.experience}, Objetivo Primario: ${userProfile.focus}.`
    : "Perfil fisiológico del atleta no definido.";

  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `
        Eres el 'Director de Rendimiento y Bienestar Integral de TrainingWithHabits'.
        Tu rol es ser un MENTOR HÍBRIDO: Entrenador de �0lite + Psicólogo Deportivo + Filósofo Estoico.

        TUS CAPACIDADES Y LÍMITES:
        1. �x�9️⬍�"️ **Entrenamiento y Nutrición**: Creas rutinas y planes de alimentación personalizados de alto nivel.
        2. �x�� **Psicología y Filosofía de Vida**:
           - SIEMPRE vincula los consejos psicológicos al rendimiento, la disciplina, la superación personal y la salud mental.
           - Usa filosofías como el Estocismo (dominio de uno mismo) o Kaizen (mejora continua).
           - Si el usuario está desmotivado, actúa como un psicólogo deportivo empático pero firme.
        3. �xa� **Límites Estrictos**:
           - NO hables de política, religión, ni temas no relacionados con el crecimiento personal o físico.
           - Si el tema se desvía, redirígelo sutilmente al entrenamiento o bienestar. "Entiendo tu punto, pero ¿cómo crees que esto afecta tu rendimiento hoy?".

        PERSONALIDAD:
        - Empático, Sabio, Motivador y Disciplinado.
        - Habla con autoridad pero cercanía.
        - Usa emojis relevantes.
        - Si te dicen "Hola", responde con energía y pregunta cómo se sienten o qué entrenarán hoy.

        CONTEXTO DEL ATLETA:
        ${profileContext}
        
        Responde siempre en el idioma que el usuario utilice.
      `,
    },
  });
};

export const createSupportSession = async () => {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `
        Eres el **Agente de Soporte Técnico de TrainingWithHabits**.
        Tu misión es ayudar a los usuarios con problemas técnicos y dudas sobre la app.

        **CONOCIMIENTO SOBRE LA APP:**
        - **TrainingWithHabits** es una app de fitness que usa IA para rutinas y seguimiento.
        - **Login**: Se puede entrar con Google, Apple, Correo Electrónico o Teléfono (SMS).
        - **Problemas Comunes**:
          - "No me llega el SMS": Verifica que pusiste el código de país (+54..). Si es modo test, usa el código fijo 123456.
          - "Error 403/400 en Google": El usuario debe verificar si la app está en "Producción" en Google Cloud, o si su correo está en la lista de testers.
          - "No veo mi progreso": Verifica que tengas internet. Los datos se guardan en Supabase.
        - **Estilo**: Amable, técnico pero claro, paciente. Usa emojis simples.
        - **Limitaciones**: No puedes acceder a la base de datos real del usuario. Solo das guías.

        Si no sabes la respuesta, sugiere contactar a: support@trainingwithhabits.app
      `,
    }
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
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            confidence: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(cleanJson(response.text)) as FoodAnalysis;
  } catch (error) {
    return { foodName: "Error", calories: 0, protein: 0, carbs: 0, fat: 0, confidence: "Low" };
  }
};

export const generatePersonalizedRoutine = async (goal: UserGoal, biometrics: UserBiometrics, muscleFocus: MuscleGroup | MuscleGroup[] | string, environment: 'home' | 'gym' = 'gym'): Promise<Routine> => {
  try {
    const isSport = typeof muscleFocus === 'string' && !Object.values(MuscleGroup).includes(muscleFocus as any);
    const focusLabel = Array.isArray(muscleFocus) ? muscleFocus.join(", ") : muscleFocus;

    const envContext = environment === 'home'
      ? "ENTORNO: CASA. REGLA ESTRICTA: NO USAR NING�aN EQUIPAMIENTO. Solo ejercicios con peso corporal (calistenia), suelo, pared o una silla estable. PROHIBIDO: Mancuernas, barras, máquinas, bandas elásticas."
      : "ENTORNO: GIMNASIO. Acceso total a equipamiento comercial.";

    const sportContext = isSport
      ? `ESTO ES UN ENTRENAMIENTO ESPECÍFICO PARA EL DEPORTE: ${muscleFocus}. Los ejercicios deben mejorar el rendimiento, fuerza y movilidad necesaria para este deporte.`
      : `ENFOQUE HOY (GRUPOS MUSCULARES): ${focusLabel}.`;

    const prompt = `
      Actúa como un entrenador de �0LITE OLÍMPICA. Crea una rutina de entrenamiento de ALTO RENDIMIENTO.
      ATLETA: Nivel ${goal.experience}, Meta: ${goal.focus}.
      ${sportContext}
      BIOMETRÍA: Peso ${biometrics.weight}kg, Altura ${biometrics.height}cm, Edad ${biometrics.age}.
      ${envContext}
      
      REGLAS:
      1. Los ejercicios deben ser biomecánicamente eficientes para el entorno dado.
      2. Incluye notas técnicas sobre cadencia o respiración.
      3. Estima una duración realista.
      4. Si es CASA, sé creativo con ejercicios de peso corporal pero mantén la intensidad alta.
      5. Si es un DEPORTE, prioriza movimientos funcionales que simulen o potencien gestos técnicos de ese deporte.
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

    // Enhanced Biometric Context
    let profileContext = "";
    if (userProfile) {
      profileContext = `
        PERFIL DEL ATLETA:
        - Nivel: ${userProfile.experience}
        - Objetivo Principal: ${userProfile.focus}
        - Datos Biométricos: Altura ${userProfile.height}cm, Peso ${userProfile.weight}kg, Edad ${userProfile.age} años, Género ${userProfile.gender}.
      `;
    }

    const envContext = environment === 'home'
      ? "ENTORNO: CASA (SIN EQUIPAMIENTO: SOLO PESO CORPORAL / CALISTENIA). No asumir que tiene bandas ni mancuernas."
      : "ENTORNO: GIMNASIO (Acceso total a máquinas, barras, poleas y peso libre).";

    const prompt = `
      Eres un experto en biomecánica y entrenador personal de élite. Crea una GUÍA T�0CNICA DE ENTRENAMIENTO para: ${muscle}.
      
      CONTEXTO:
      ${goalContext}
      ${profileContext}
      ${envContext}

      TUS INSTRUCCIONES:
      1. ADAPTA LA DIFICULTAD Y VOLUMEN a la experiencia y edad del atleta. (Ej. Si es principiante/mayor, ejercicios más seguros. Si es avanzado, técnicas de intensidad).
      2. ADAPTA LA SELECCI�N DE EJERCICIOS al entorno (${environment}).
         - CASA: ¡Solo Peso Corporal/Muebles! Prohibido equipamiento de gimnasio.
         - GIMNASIO: Usa lo mejor del equipamiento disponible.
      3. ENFOQUE BIOM�0TRICO: Considera el peso corporal (${userProfile?.weight || 'N/A'}kg) para sugerir repeticiones o progresiones (ej. si es pesado, ejercicios de bajo impacto o menor volumen en calistenia).

      RETORNA JSON (Mínimo 4 ejercicios):
      {
        "muscle": "${muscle}",
        "introduction": "Análisis biomecánico personalizado para el atleta y su entorno.",
        "exercises": [
          { 
            "name": "Nombre Ejercicio",
            "difficulty": "Principiante/Intermedio/Avanzado",
            "instructions": ["Paso 1", "Paso 2", "Paso 3"],
            "commonError": "Error crítico a evitar",
            "gifUrl": "URL opcional (deja vacío si no estás seguro)" 
          }
        ]
      }
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

    // Enhanced Biometric Context for Sports
    let profileContext = "";
    if (userProfile) {
      profileContext = `
        PERFIL DEL ATLETA:
        - Nivel: ${userProfile.experience}
        - Datos Biométricos: Altura ${userProfile.height}cm, Peso ${userProfile.weight}kg, Edad ${userProfile.age} años.
        - Objetivo: ${userProfile.focus}
      `;
    }

    const prompt = `
      Crea una rutina de acondicionamiento físico específica para el deporte: ${sport}.
      
      CONTEXTO:
      ${goalContext}
      ${profileContext}
      ${envContext}

      TUS INSTRUCCIONES:
      1. Diseña una rutina que mejore el rendimiento en ${sport}, considerando la biometría del atleta (peso/edad).
      2. Si el atleta es pesado, evita ejercicios de alto impacto articular si no son necesarios.
      3. Selecciona ejercicios específicos para la musculatura usada en ${sport}.
      
      RETORNA JSON:
      {
        "sport": "${sport}",
        "focus": "Enfoque principal (e.g. Potencia de Salto, Resistencia Aeróbica)",
        "introduction": "Estrategia de entrenamiento basada en tu perfil biométrico.",
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
