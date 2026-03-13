// Definimos la estructura del mensaje para que coincida con la lista 'history' de Java
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// Interfaz para la petición (basada en tu ChatRequest.java)
interface ChatRequest {
  message: string;
  systemPrompt: string;
  temperature: number;
  history: Message[];
}

// Interfaz para la respuesta del controlador
interface ChatResponse {
  role: string;
  content: string;
  status: "success" | "error";
  message?: string; // Solo viene si hay error
  history: Message[]; // Opcional, si quieres devolver el historial actualizado desde el backend
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const sendChatMessage = async (
  payload: ChatRequest,
): Promise<ChatResponse> => {
  try {
    if (!API_BASE_URL) {
      throw new Error(
        "La URL de la API no está configurada. Revisa tu archivo .env",
      );
    }
    const response = await fetch(`${API_BASE_URL}/chat/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error en la comunicación con el servidor",
      );
    }

    return await response.json();
  } catch (error) {
    console.error("ChatService Error:", error);
    throw error;
  }
};

export const fetchChatHistory = async (): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/messages`);
  if (!response.ok) throw new Error("Error cargando historial");
  return await response.json();
};
