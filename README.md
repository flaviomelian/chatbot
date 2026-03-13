<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/a72f696d-13b4-471d-bfb3-4bd8516d5558" />

# AI Chatbot Ecosystem (Next.js + Spring Boot + FastAPI + Azure OpenAI)

Este proyecto es un ecosistema de chatbot de nivel empresarial que utiliza una arquitectura desacoplada para separar la interfaz de usuario, la lógica de negocio y la orquestación de inteligencia artificial.

## 🏗️ Arquitectura del Sistema
La aplicación se divide en cuatro capas principales:

Frontend (Next.js): Interfaz de chat moderna, reactiva y optimizada.

Orquestador (Spring Boot): Gestión de usuarios, seguridad y persistencia de datos en MySQL.

AI Proxy (FastAPI): Microservicio especializado en Python para la comunicación fluida con modelos de lenguaje.

Modelo (Azure OpenAI): Integración con GPT-4o para procesamiento de lenguaje natural.

## 🚀 Flujo de Datos
El usuario envía un mensaje desde el Frontend.

Spring Boot recibe la petición, la valida y guarda el historial en MySQL.

Spring Boot delega la generación de la respuesta al servicio FastAPI.

FastAPI conecta con Azure OpenAI para obtener la respuesta de GPT-4o.

La respuesta recorre el camino inverso, almacenándose en la base de datos antes de mostrarse al usuario.

## 🛠️ Tecnologías Utilizadas
Frontend: Next.js, Tailwind CSS, Lucide React.

Backend Principal: Java 17+, Spring Boot 3.x, Spring Data JPA.

Microservicio de IA: Python 3.10+, FastAPI, Azure OpenAI SDK.

Base de Datos: MySQL 8.0.

## 📋 Requisitos Previos
Node.js (v18 o superior)

JDK 17

Python 3.10+

Instancia de MySQL en ejecución

Clave de API y Endpoint de Azure OpenAI

## 🔧 Configuración
### 1. Backend Python (FastAPI)
Bash
cd backend-python
pip install -r requirements.txt
# Configurar variables de entorno (.env) con AZURE_OPENAI_API_KEY
uvicorn main:app --reload --port 8000
### 2. Backend Java (Spring Boot)
Configura el archivo application.properties con tus credenciales de MySQL y la URL del servicio FastAPI.

Bash
cd backend-java
./mvnw spring-boot:run
## #3. Frontend (Next.js)
Bash
cd frontend
npm install
npm run dev

## 🧠 Ventajas de esta Arquitectura
Escalabilidad: Cada componente puede escalarse de forma independiente según la carga.

Mantenibilidad: El código de IA (Python) está separado de la lógica de negocio (Java).

Flexibilidad: Es sencillo intercambiar GPT-4o por cualquier otro modelo (Llama, Claude) simplemente modificando el microservicio de Python.
