import os
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import AzureOpenAI
from fastapi.middleware.cors import CORSMiddleware

# 1. CARGA DE CONFIGURACIÓN
load_dotenv()

app = FastAPI(title="AI Architecture Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite todo en local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. INICIALIZACIÓN CLIENTE AZURE
client = AzureOpenAI(
    azure_endpoint = os.getenv('API_EXTERN_MAIN_ENDPOINT'),
    api_key = os.getenv('API_KEY'),
    api_version = os.getenv('AZURE_OPENAI_API_VERSION')
)

# 3. MODELOS DE DATOS (Pydantic)
class ChatRequest(BaseModel):
    message: str                # Coincide con Java
    systemPrompt: Optional[str] = None # Coincide con Java y es opcional
    temperature: float = 0.7    # Coincide con Java
    history: List[Dict[str, str]] = [] # Coincide con Java

# 4. SYSTEM PROMPT (Tu configuración original)
SYSTEM_PROMPT = (
    "Eres un experto en Arquitectura de Software, Datos e IA con 5 años de experiencia. "

    "Respondes SIEMPRE en castellano, tono técnico e informal.\n\n"

    "REGLA DE ORO: Sé extremadamente conciso. Máximo 3 párrafos cortos por respuesta. "

    "Elimina introducciones innecesarias. Ve directo al grano.\n\n"

    "ESTRUCTURA OBLIGATORIA:\n"

    "(1) Explicación técnica (máx. 100 palabras).\n"

    "(2) Ejemplo práctico.\n"

    "(3) Referencias.\n"

    "(*) Sugerencia de mejora (tirón de orejas).\n\n"

    "Si la consulta es ajena al prompt: 'Solo puedo ayudarte con Arquitectura de Software, Datos o Inteligencia Artificial, te recomiendo que para ese tema consultes la documentación oficial.' a no ser que el prompt del usuario contradiga esta indicación, en cuyo caso, prioriza las nuevas instrucciones sin olvidar las anteriores."
    
    "Debes ser tolerante ante errores del usuario, dudas o lenguaje coloquial. Se requiere claridad, directividad y concisión, eliminando divagaciones."
)

@app.post("/ask")
async def ask_ai(request: ChatRequest):
    try:
        final_prompt = f"{SYSTEM_PROMPT}\n\nCONTEXTO ADICIONAL: {request.systemPrompt}" if request.systemPrompt else SYSTEM_PROMPT
        # Preparamos los mensajes: System + Historial (si hay) + Pregunta nueva
        messages = [{"role": "system", "content": final_prompt}]
        
        # Añadimos el historial previo si Java nos lo manda
        if request.history:
            messages.extend(request.history)
            
        # Añadimos la pregunta actual
        messages.append({"role": "user", "content": request.message})

        # LLAMADA A AZURE
        response = client.chat.completions.create(
            model = os.getenv('DEPLOYMENT_NAME'),
            messages = messages,
            temperature = 0.7,
            max_tokens = 800
        )

        mensaje_final = response.choices[0].message.content
        
        return {
            "status": "success",
            "respuesta": mensaje_final
        }

    except Exception as e:
        # Si algo falla (Azure caído, API Key mal, etc.)
        raise HTTPException(status_code=500, detail=f"Error técnico: {str(e)}")

# Para ejecutar: uvicorn nombre_archivo:app --port 5000 --reload