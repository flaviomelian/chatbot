import os
from dotenv import load_dotenv
from openai import AzureOpenAI
load_dotenv()
client = AzureOpenAI(
    azure_endpoint = os.getenv('API_EXTERN_MAIN_ENDPOINT'),
    api_key = os.getenv('API_KEY'),
    api_version = os.getenv('AZURE_OPENAI_API_VERSION')
)
response = client.chat.completions.create(
    model = os.getenv('DEPLOYMENT_NAME'),
    messages = [
        {'role': 'system', 'content': 'Eres un asistente técnico útil.'},
        {'role': 'user', 'content': 'Explica qué es una API en dos frases.'}
    ]
)
print(response.choices[0].message.content)