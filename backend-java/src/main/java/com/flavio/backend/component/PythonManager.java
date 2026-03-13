package com.flavio.backend.component;
import java.io.IOException;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Component
public class PythonManager {

    private Process pythonProcess;

    @PostConstruct
    public void startPythonAPI() {
        Thread pythonThread = new Thread(() -> {
            try {
                ProcessBuilder pb = new ProcessBuilder(
                    "venv/Scripts/python", "-m", "uvicorn", "main:app", "--port", "5000"
                );
                // Importante: establecer el directorio de trabajo donde está el venv
                pb.directory(new java.io.File("./backend-python")); 
                pb.redirectErrorStream(true);
                
                System.out.println("Cargando motor de IA (FastAPI)...");
                pythonProcess = pb.start();
                
                // Opcional: ver los logs de Python en la consola de Java
                pythonProcess.getInputStream().transferTo(System.out);
                
            } catch (IOException e) {
                System.err.println("¡Cagada! No se pudo arrancar Python: " + e.getMessage());
            }
        });
        
        pythonThread.setDaemon(true); // Para que no bloquee el cierre de la app
        pythonThread.start();
    }

    @PreDestroy
    public void stopPythonAPI() {
        if (pythonProcess != null && pythonProcess.isAlive()) {
            System.out.println("Cerrando motor de IA...");
            pythonProcess.destroy();
        }
    }
}