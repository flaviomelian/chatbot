import os
import tiktoken
import customtkinter as ctk
from dotenv import load_dotenv
from openai import AzureOpenAI

# 1. Configuración de Backend
load_dotenv()
client = AzureOpenAI(
    azure_endpoint=os.getenv('API_EXTERN_MAIN_ENDPOINT'),
    api_key=os.getenv('API_KEY'),
    api_version=os.getenv('AZURE_OPENAI_API_VERSION')
)
deployment_name = os.getenv('DEPLOYMENT_NAME')
enc = tiktoken.encoding_for_model('gpt-4o')

# CONFIGURACIÓN INICIAL
CONFIG = {
    'system_prompt': (
        "Eres un experto en Arquitectura de Software, Datos e IA.\n"
        "Respondes SIEMPRE en castellano, tono técnico e informal.\n"
        "Estructura: (1) Técnica, (2) Ejemplo, (3) Docs, (*) Tirón de orejas."
    ),
    'temperature' : 0.7,
    'max_tokens' : 800,
    'max_historial' : 10, 
}

historial = []

def contar_tokens(messages):
    return sum(len(enc.encode(m['content'])) for m in messages)

class AzureChatApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Azure AI Foundry | Enterprise Client v3.1")
        self.geometry("1150x850")
        
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # --- SIDEBAR ---
        self.sidebar = ctk.CTkFrame(self, width=280, corner_radius=0)
        self.sidebar.grid(row=0, column=0, rowspan=2, sticky="nsew")
        
        self.logo_label = ctk.CTkLabel(self.sidebar, text="AZURE AI\nCONFIG", font=ctk.CTkFont(size=20, weight="bold"))
        self.logo_label.pack(pady=(20, 10))

        # ÁREA DE TEXTO SYSTEM PROMPT
        self.prompt_label = ctk.CTkLabel(self.sidebar, text="System Prompt Override:", font=ctk.CTkFont(weight="bold"))
        self.prompt_label.pack(pady=(10, 0), padx=10, anchor="w")

        self.custom_prompt_box = ctk.CTkTextbox(self.sidebar, width=240, height=200, font=("Consolas", 11))
        self.custom_prompt_box.pack(pady=10, padx=10)
        self.custom_prompt_box.insert("0.0", CONFIG['system_prompt'])

        # --- CONTROL DE TEMPERATURA (NUEVO) ---
        self.temp_label = ctk.CTkLabel(self.sidebar, text=f"Temperature: {CONFIG['temperature']}", font=ctk.CTkFont(weight="bold"))
        self.temp_label.pack(pady=(10, 0), padx=10, anchor="w")

        self.temp_slider = ctk.CTkSlider(self.sidebar, from_=0, to=2, number_of_steps=20, command=self.update_temp)
        self.temp_slider.set(CONFIG['temperature'])
        self.temp_slider.pack(pady=10, padx=10, fill="x")

        # INFO PARÁMETROS
        self.info_params = ctk.CTkLabel(self.sidebar, text=f"MaxTokens: {CONFIG['max_tokens']}\nHistory Limit: {CONFIG['max_historial']}", 
                                        justify="left", font=("Consolas", 11), fg_color="#2b2b2b", corner_radius=5)
        self.info_params.pack(pady=10, padx=10, fill="x")

        self.btn_reset = ctk.CTkButton(self.sidebar, text="RESET HISTORY", fg_color="#c0392b", command=self.reset_chat)
        self.btn_reset.pack(pady=20, padx=20)

        # --- CHAT DISPLAY ---
        self.chat_display = ctk.CTkTextbox(self, state="disabled", corner_radius=15, border_width=1, fg_color="#1e1e1e", font=("Trebuchet MS", 14))
        self.chat_display.grid(row=0, column=1, padx=20, pady=20, sticky="nsew")

        # --- INPUT FRAME ---
        self.input_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.input_frame.grid(row=1, column=1, padx=20, pady=(0, 20), sticky="ew")
        self.input_frame.grid_columnconfigure(0, weight=1)

        self.user_input = ctk.CTkEntry(self.input_frame, placeholder_text="Escriba aquí...", height=50)
        self.user_input.grid(row=0, column=0, padx=(0, 10), sticky="ew")
        self.user_input.bind("<Return>", lambda e: self.procesar_mensaje())

        self.send_button = ctk.CTkButton(self.input_frame, text="RUN", width=100, height=50, command=self.procesar_mensaje)
        self.send_button.grid(row=0, column=1)

        self.actualizar_pantalla("SYSTEM", "AI ENGINE READY. Temperature control active.")

    def update_temp(self, value):
        CONFIG['temperature'] = round(value, 2)
        self.temp_label.configure(text=f"Temperature: {CONFIG['temperature']}")

    def reset_chat(self):
        global historial
        historial = []
        self.actualizar_pantalla("SYSTEM", "Historial borrado.")

    def procesar_mensaje(self):
        global historial
        entrada = self.user_input.get().strip()
        if not entrada: return
        self.user_input.delete(0, 'end')

        # Comandos rápidos
        if entrada == '/tokens':
            p_actual = self.custom_prompt_box.get("0.0", "end").strip() or CONFIG['system_prompt']
            self.actualizar_pantalla("SYSTEM", f"Tokens: {contar_tokens([{'role':'system','content':p_actual}]+historial)}")
            return

        self.actualizar_pantalla("USER", entrada)

        prompt_actual = self.custom_prompt_box.get("0.0", "end").strip() or CONFIG['system_prompt']
        historial.append({'role': 'user', 'content': entrada})
        
        try:
            # Usamos el valor actual de CONFIG['temperature'] actualizado por el slider
            response = client.chat.completions.create(
                model=deployment_name, 
                messages=[{'role': 'system', 'content': prompt_actual}] + historial[-(CONFIG['max_historial']*2):],
                temperature=CONFIG['temperature'],
                max_tokens=CONFIG['max_tokens']
            )
            
            resp_txt = response.choices[0].message.content
            historial.append({"role": "assistant", "content": resp_txt})
            
            self.actualizar_pantalla("AZURE-IA", resp_txt)
            self.actualizar_pantalla("SYSTEM", f"[Temp: {CONFIG['temperature']} | In: {response.usage.prompt_tokens} | Out: {response.usage.completion_tokens}]")
            
        except Exception as e:
            self.actualizar_pantalla("ERROR", str(e))

    def actualizar_pantalla(self, emisor, texto):
        self.chat_display.configure(state="normal")
        header = {"USER": ">>>> USER", "AZURE-IA": "<<<< AZURE_RESPONSE", "SYSTEM": "[!] STATUS"}.get(emisor, emisor)
        self.chat_display.insert("end", f"\n{header}\n{'-'*40}\n{texto}\n")
        self.chat_display.configure(state="disabled")
        self.chat_display.see("end")

if __name__ == "__main__":
    app = AzureChatApp()
    app.mainloop()