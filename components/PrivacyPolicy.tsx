import React from 'react';
import { ChevronLeft, Shield } from 'lucide-react';

interface PrivacyPolicyProps {
    onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-brand-dark text-slate-300 font-sans p-6 sm:p-12 animate-in fade-in slide-in-from-bottom-10">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-brand-500 hover:text-white transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
                >
                    <ChevronLeft size={16} /> Volver
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center text-brand-500">
                        <Shield size={24} />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Política de Privacidad</h1>
                </div>

                <div className="space-y-8 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">1. Introducción</h2>
                        <p>En Growth Ladder, nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestra aplicación.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">2. Información que Recopilamos</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Información de Cuenta:</strong> Correo electrónico, nombre, foto de perfil (si inicias con Google/Apple) y número de teléfono (si usas autenticación SMS).</li>
                            <li><strong>Datos Biométricos:</strong> Peso, altura, edad, género y nivel de experiencia. Estos datos se usan EXCLUSIVAMENTE para personalizar tus rutinas y análisis de IA.</li>
                            <li><strong>Datos de Actividad:</strong> Registros de entrenamientos, ejercicios realizados, cargas y repeticiones.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">3. Uso de la Información</h2>
                        <p>Utilizamos tus datos para:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Proporcionar funciones personalizadas de entrenamiento y nutrición ("Trainer IA", "Chef IA").</li>
                            <li>Mejorar la precisión de los algoritmos de recomendación.</li>
                            <li>Mantener la seguridad de tu cuenta y prevenir fraudes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">4. Compartir Información</h2>
                        <p><strong>No vendemos ni alquilamos tus datos personales a terceros.</strong></p>
                        <p className="mt-2">Compartimos datos solo con proveedores de servicios esenciales (como Supabase para base de datos y autenticación, o Google Gemini para la IA), bajo estrictos acuerdos de confidencialidad.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">5. Seguridad</h2>
                        <p>Implementamos medidas de seguridad de "grado militar" (encriptación en tránsito y en reposo) para proteger tus datos contra accesos no autorizados.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-3">6. Tus Derechos</h2>
                        <p>Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. Puedes hacerlo desde la configuración de tu perfil en la app o contactando a soporte.</p>
                    </section>

                    <div className="pt-8 border-t border-white/10 text-xs text-slate-500">
                        <p>Última actualización: Febrero 2026</p>
                        <p>Si tienes dudas, contáctanos a traves del chat de soporte.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
