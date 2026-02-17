import React from 'react';
import { X, ShieldCheck, FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

interface TermsAndConditionsProps {
    onClose: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f0f0f] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/5 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-xl">
                            <Scale className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Términos y Condiciones de Uso</h2>
                            <p className="text-xs text-slate-400 font-medium">Última actualización: Febrero 2026</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors active:scale-95"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 text-slate-300 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">

                    <section>
                        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="text-brand-500">1.</span> Aceptación de los Términos
                        </h3>
                        <p>
                            Bienvenido a <strong>Growth Ladder</strong> ("la Aplicación"). Al descargar, acceder o utilizar la Aplicación, usted ("el Usuario") acepta estar legalmente vinculado por estos Términos y Condiciones ("Términos"). Si no está de acuerdo con alguno de estos términos, no debe utilizar la Aplicación.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="text-brand-500">2.</span> Exención de Responsabilidad Médica
                        </h3>
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3">
                            <AlertTriangle className="text-red-500 shrink-0" size={20} />
                            <div>
                                <strong className="text-red-400 block mb-1">Advertencia de Salud Importante</strong>
                                <p className="text-xs text-red-100/80">
                                    Growth Ladder no es un proveedor de atención médica. El contenido, rutinas e información proporcionada por la IA (Coach, Chef, Director de Rendimiento) son solo para fines informativos y educativos.
                                </p>
                            </div>
                        </div>
                        <ul className="list-disc pl-5 mt-3 space-y-2 marker:text-zinc-600">
                            <li>Usted debe consultar a su médico antes de comenzar cualquier programa de ejercicios o nutrición.</li>
                            <li>El uso de la información proporcionada es bajo su propio riesgo.</li>
                            <li>Growth Ladder no se hace responsable de lesiones o daños resultantes del uso de la Aplicación.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="text-brand-500">3.</span> Uso de la Inteligencia Artificial
                        </h3>
                        <p>
                            Nuestros servicios utilizan modelos de Inteligencia Artificial para generar recomendaciones. Aunque nos esforzamos por la precisión:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-zinc-600">
                            <li>La IA puede cometer errores o proporcionar información imprecisa ("alucinaciones").</li>
                            <li>No debe seguir ciegamente instrucciones que parezcan peligrosas, ilógicas o contraindicadas para su salud.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="text-brand-500">4.</span> Cuentas de Usuario y Seguridad
                        </h3>
                        <p>
                            Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Growth Ladder se reserva el derecho de suspender cuentas que violen estos términos o realicen actividades fraudulentas.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="text-brand-500">5.</span> Propiedad Intelectual
                        </h3>
                        <p>
                            Todo el contenido, marcas, logotipos y software son propiedad de Growth Ladder o sus licenciantes. Se prohíbe la reproducción, distribución o ingeniería inversa sin autorización expresa.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="text-brand-500">6.</span> Pagos y Suscripciones (Versión PRO)
                        </h3>
                        <p>
                            Ciertas funciones están reservadas para usuarios PRO. Las suscripciones se renuevan automáticamente a menos que se cancelen con 24 horas de antelación al final del período actual. No se ofrecen reembolsos por períodos parciales no utilizados.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                            <span className="text-brand-500">7.</span> Modificaciones
                        </h3>
                        <p>
                            Growth Ladder se reserva el derecho de modificar estos Términos en cualquier momento. El uso continuado de la Aplicación tras dichos cambios constituye su aceptación de los nuevos Términos.
                        </p>
                    </section>

                    <div className="pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-slate-500">
                            Para consultas legales o soporte, contáctenos en: <a href="mailto:legal@growthladder.app" className="text-brand-500 hover:underline">legal@growthladder.app</a>
                        </p>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors shadow-lg active:scale-95"
                    >
                        Entendido, Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
};
