import React, { useState, useRef, useEffect } from 'react';
import { useToast } from './ToastContext'; // Assuming this exists or similar
import { Send, ChefHat, Sparkles, Loader2, Utensils, Volume2, User, Mic, Camera, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { UserProfile } from '../types';

interface ChefChatProps {
    userProfile: UserProfile | null;
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

interface Message {
    role: 'user' | 'model';
    text: string;
}

type VoiceGender = 'male' | 'female';

export const ChefChat: React.FC<ChefChatProps> = ({ userProfile }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: '¡Hola! Soy tu Chef y Nutricionista. ¿En qué te ayudo?\n\n1. 🍽️ **Recetas Fitness**\n2. 🍎 **Calorías y Macros**' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Voice State
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [resumeAudioContext, setResumeAudioContext] = useState(false);
    const [preferredGender, setPreferredGender] = useState<VoiceGender>(() => {
        return (localStorage.getItem('chef_voice_gender') as VoiceGender) || 'female';
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            setVoices(available);
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const getBestVoice = (gender: VoiceGender): SpeechSynthesisVoice | null => {
        const esVoices = voices.filter(v => v.lang.startsWith('es'));
        const femaleNames = ['Helena', 'Sabina', 'Laura', 'Paulina', 'Monica', 'Zira', 'Elena'];

        if (gender === 'female') {
            // Prioritize known high-quality female voices or Google
            return esVoices.find(v => v.name.includes('Google') || femaleNames.some(n => v.name.includes(n))) || esVoices[0] || null;
        } else {
            // Prioritize known male voices
            const maleVoice = esVoices.find(v => v.name.includes('Pablo') || v.name.includes('Raul') || v.name.includes('Jorge') || v.name.includes('Juan') || v.name.includes('Alvaro') || v.name.includes('Manuel') || v.name.includes('David') || v.name.includes('Mark'));
            if (maleVoice) return maleVoice;

            // 2. Microsoft voices that are NOT female
            const microsoftMale = esVoices.find(v => v.name.includes('Microsoft') && !femaleNames.some(n => v.name.includes(n)));
            if (microsoftMale) return microsoftMale;

            return esVoices.find(v => !v.name.includes('Google') && !femaleNames.some(n => v.name.includes(n))) || esVoices[0] || null;
        }
    };

    const speakText = (text: string) => {
        // Cancel previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = getBestVoice(preferredGender);
        if (voice) utterance.voice = voice;

        utterance.rate = 1.0;
        utterance.pitch = preferredGender === 'female' ? 1.0 : 0.9;

        window.speechSynthesis.speak(utterance);
    };

    const toggleVoice = () => {
        const newGender = preferredGender === 'female' ? 'male' : 'female';
        setPreferredGender(newGender);
        localStorage.setItem('chef_voice_gender', newGender);

        // Test voice briefly
        const testMsg = newGender === 'female' ? "Hola, soy tu Chef." : "Hola, soy tu Chef.";
        const utterance = new SpeechSynthesisUtterance(testMsg);
        const voice = getBestVoice(newGender);
        if (voice) utterance.voice = voice;
        utterance.pitch = newGender === 'female' ? 1.0 : 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || loading) return;

        const userMsg = input.trim();
        setInput('');

        const currentImage = selectedImage;
        setSelectedImage(null);

        let tempUserMsg = userMsg;
        if (currentImage && !tempUserMsg) {
            tempUserMsg = "Analiza esta comida.";
        }

        setMessages(prev => [...prev, { role: 'user', text: tempUserMsg + (currentImage ? "\n\n*[Imagen Adjunta]*" : "") }]);
        setLoading(true);

        try {
            const profileContext = userProfile
                ? `PERFIL COMENSAL: ${userProfile.gender || 'neutral'}, objetivo: ${userProfile.focus}, nivel: ${userProfile.experience}.`
                : "";

            const prompt = `
        Eres un CHEF DE ALTA COCINA (Estrella Michelin) y a la vez un NUTRICIONISTA DEPORTIVO de élite.
        Tu misión es crear recetas y planes de alimentación DELICIOSOS pero perfectamente optimizados para el rendimiento físico.
        
        ${profileContext}

        INSTRUCCIONES DE COMPORTAMIENTO (PRIORIDAD ALTA):
        1. SI el usuario saluda ("hola", "buenas", etc.): Responde textualmente: "¡Hola! Soy tu Chef Estrella Michelin y Nutricionista. ¿En qué puedo ayudarte hoy?\n\n1. 🍽️ **Pedir una receta fitness** (Dime qué ingredientes tienes o qué te apetece).\n2. 🍎 **Consultar calorías/macros** (Pregúntame por cualquier alimento)."
        2. SI pide una receta: Proporciona una receta creativa, fitness y deliciosa.
        3. SI te envía una IMAGEN DE COMIDA: Debes analizar visualmente la imagen e identificar de qué plato o ingrediente(s) se trata. Luego proporciona:
           - Un listado de los ingredientes principales.
           - Proporciones estimadas.
           - Información Nutricional Detallada: proteínas, carbohidratos, grasas, gramos aproximados en total.
           - Si aplica, menciona otros detalles relevantes (fibra, micronutrientes, etc.) con estilo de Chef.
        4. SI pregunta por calorías/macros de un ALIMENTO: Responde con la información nutricional precisa y breve.
        5. SI pregunta sobre CUALQUIER OTRA COSA (ej: ejercicios, rutinas, clima, noticias, "creame una rutina", etc.): Responde textualmente: "👨‍🍳 Lo siento, solo puedo ayudarte con **Recetas Fitness** o **Información Nutricional de Alimentos**. Para rutinas de entrenamiento, por favor consulta con mi colega, el Coach IA."
        
        ESTILO DE RESPUESTA:
        - Pasión por la comida (usa términos culinarios: "sellar", "emulsionar", "al dente").
        - Rigor científico (explica los macros brevemente).
        - Estructura clara (Ingredientes, Pasos, Por qué funciona para el objetivo).
        - Nunca des consejos médicos, solo nutricionales/gastronómicos.
        
        USUARIO DICE: "${tempUserMsg}"
      `;

            const parts: any[] = [{ text: prompt }];
            if (currentImage) {
                const base64Data = currentImage.split(',')[1] || currentImage;
                parts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Data
                    }
                });
            }

            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [{
                    role: "user",
                    parts: parts
                }]
            });

            const text = response.text || "El chef está probando la salsa... inténtalo de nuevo en un segundo.";
            setMessages(prev => [...prev, { role: 'model', text }]);

        } catch (error) {
            console.error(error);
            toast("El chef tuvo un accidente en la cocina (Error de IA).", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in pb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-t-2xl shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <ChefHat className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-white font-black uppercase text-lg leading-none">Chef IA</h2>
                        <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase">Gastronomía de Alto Rendimiento</p>
                    </div>
                </div>

                {/* Voice Gender Toggle */}
                <button
                    onClick={toggleVoice}
                    className="flex items-center gap-2 bg-black/20 hover:bg-black/30 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/10"
                    title={`Cambiar a voz ${preferredGender === 'female' ? 'masculina' : 'femenina'}`}
                >
                    <div className="relative">
                        <Mic size={14} />
                        <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${preferredGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'}`}></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {preferredGender === 'female' ? 'Ella' : 'Él'}
                    </span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/50 backdrop-blur-sm border-x border-slate-800">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative group ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}`}>
                            <div className="prose prose-invert text-sm prose-p:leading-relaxed prose-headings:text-orange-400 prose-strong:text-white">
                                <ReactMarkdown>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                            {msg.role === 'model' && (
                                <button
                                    onClick={() => speakText(msg.text)}
                                    className="absolute -bottom-6 left-0 p-1 text-slate-400 hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                                    title="Escuchar"
                                >
                                    <Volume2 size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{preferredGender === 'female' ? 'Voz F' : 'Voz M'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <Loader2 className="animate-spin text-orange-500" size={16} /> Cocinando respuesta...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-2 border-t border-slate-800 bg-black/40 rounded-b-2xl">
                {selectedImage && (
                    <div className="mb-2 ml-2 relative inline-block">
                        <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg border-2 border-orange-500 shadow-xl" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
                <div className="relative flex items-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-slate-400 hover:text-orange-500 hover:bg-white/5 rounded-xl transition-all h-[56px] w-[56px] flex items-center justify-center shrink-0"
                    >
                        <Camera size={24} />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="¿Qué comemos hoy, Chef?"
                        className="w-full bg-zinc-900 border border-slate-700 text-white rounded-xl py-4 pl-4 pr-12 focus:border-orange-500 outline-none transition-all shadow-inner min-h-[56px]"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || (!input.trim() && !selectedImage)}
                        className="absolute right-2 p-2 bg-transparent hover:bg-white/10 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 h-10 w-10 flex items-center justify-center"
                    >
                        <img src="/send-icon.svg" alt="Enviar" className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
