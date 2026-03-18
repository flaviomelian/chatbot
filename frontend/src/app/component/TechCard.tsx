// Define esto justo antes del return de tu componente principal
export const TechCard = ({ tech }) => (
    <div className="bg-white dark:bg-zinc-900 p-6 md:p-7 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-blue-900/20 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-5">
            <span className={`text-3xl md:text-4xl font-bold ${tech.iconColor} w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gray-50 dark:bg-zinc-800 rounded-full shadow-inner transition-colors`}>
                {tech.icon}
            </span>
            <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-950 dark:text-white transition-colors">
                    {tech.name}
                </h3>
                <span className="text-xs md:text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full inline-block mt-1 transition-colors">
                    {tech.role}
                </span>
            </div>
        </div>
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-6 flex-grow leading-relaxed transition-colors">
            {tech.description}
        </p>
        <div className="border-t border-gray-100 dark:border-zinc-800 pt-5 mt-auto transition-colors">
            <strong className="text-gray-900 dark:text-white block mb-3 font-semibold transition-colors">Funciones Clave:</strong>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc list-outside ml-5 text-sm leading-relaxed transition-colors">
                {tech.functions.map((func, fIndex) => (
                    <li key={fIndex}>{func}</li>
                ))}
            </ul>
        </div>
    </div>
);