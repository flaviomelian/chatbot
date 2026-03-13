package com.flavio.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        // 1. Cargar el archivo .env
        // .configure().ignoreIfMissing() evita que la app pete si el archivo no está
        Dotenv dotenv = Dotenv.configure().directory(".").ignoreIfMissing().load();

        // 2. Inyectar las variables en el sistema de Spring
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
			System.out.println("Cargando: " + entry.getKey() + " = " + entry.getValue());
        });

        // 3. Arrancar la aplicación
        SpringApplication.run(BackendApplication.class, args);
    }
}