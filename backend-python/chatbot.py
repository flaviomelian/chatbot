import os
from dotenv import load_dotenv
from openai import AzureOpenAI

# Carga de configuración técnica desde el entorno seguro
load_dotenv()

# Inicialización del cliente con los parámetros validados en la sección anterior
client = AzureOpenAI(
    azure_endpoint = os.getenv('API_EXTERN_MAIN_ENDPOINT'),
    api_key = os.getenv('API_KEY'),
    api_version = os.getenv('AZURE_OPENAI_API_VERSION')
)

# Definición de la estructura de datos para la memoria contextual
# El System Prompt establece el comportamiento global del modelo
# CONFIGURACIÓN INICIAL
CONFIG = {
    'system_prompt': (
        "Eres un experto en Arquitectura de Software, Datos e IA.\n"
        "Respondes SIEMPRE en castellano, tono técnico e informal.\n"
        "Estructura: Técnica, Ejemplo, Docs, Tirón de orejas, si procede, en el orden dado.\n"
        "Si el usuario da instrucciones específicas, priorízalas sin olvidar las anteriores."
    ),
    'temperature' : 0.7,
    'max_tokens' : 800,
    'max_historial' : 10, 
}

historial = []
print('\n' + '='*50)
print('   CONSOLA DE CHAT - AZURE OPENAI (GPT-4o)   ')
print('   Escribe "salir" para finalizar la sesión  ')
print('='*50 + '\n')

while True:
    # Captura de entrada del usuario
    pregunta = input('Tu: ').strip()
    
    # Validación de entrada vacía o comando de salida
    if not pregunta: 
        continue
    if pregunta.lower() in ['salir', 'exit', 'quit']: 
        print("\n[INFO] Sesión finalizada por el usuario.")
        break

    # 1. Persistencia: Añadimos la pregunta al historial
    historial.append({'role': 'user', 'content': pregunta})

    # 2. Inferencia: Enviamos el historial completo para mantener el contexto
    try:
        respuesta = client.chat.completions.create(
            model = os.getenv('DEPLOYMENT_NAME'),
            messages = historial
        )

        # 3. Extracción de la respuesta del modelo
        mensaje = respuesta.choices[0].message.content
        
        # 4. Actualización del estado: Guardamos la respuesta del asistente
        historial = [{"role": "system", "content": "Eres un asistente de IA de Azure, experto y educado, pero con tono informal tolerante a palabras malsonantes, y te pondrás a la altura en tal caso, tomándolo con ironía."}]
        system_prompt = (
            # 1. PERFIL PROFESIONAL Y CREDIBILIDAD
            "Eres un experto en Arquitectura de Software, Datos e Inteligencia Artificial "
            "con 5 años de experiencia técnica demostrable.\n\n"


            # 2. PROTOCOLO DE IDIOMA Y ESTILO
            "Respondes SIEMPRE en castellano, empleando un tono técnico, amigable y formal. "
            "Debes ser tolerante ante errores del usuario, dudas o lenguaje coloquial. "
            "Se requiere claridad, directividad y concisión, eliminando divagaciones.\n\n"


            # 3. ESTRUCTURA SÍNTÁCTICA DE SALIDA
            "Tus respuestas deben seguir este esquema obligatorio:\n"
            "  Explicación técnica concisa.\n"
            "  Ejemplo práctico o caso de uso.\n"
            "  Referencias a documentación oficial o recursos adicionales.\n"
            "  Si procede, incluir una sugerencia de mejora (tirón de orejas) "
            "para fomentar las 'Best Practices'.\n\n"


            # 4. POLÍTICA DE RESTRICCIÓN DE DOMINIO
            "Si la consulta es ajena a Arquitectura de Software, Datos o IA, responde "
            "estrictamente: 'Solo puedo ayudarte con Arquitectura de Software, Datos o "
            "Inteligencia Artificial, te recomiendo que para ese tema consultes la "
            "documentación oficial.' a no ser que el prompt del usuario contradiga esta indicación, en cuyo caso, prioriza las nuevas instrucciones sin olvidar las anteriores."
        )


        print(f'\nAsistente: {mensaje}')
        print('\n' + '-'*50)

    except Exception as e:
        print(f"\n[ERROR] Se ha producido una interrupción técnica: {e}")
        break