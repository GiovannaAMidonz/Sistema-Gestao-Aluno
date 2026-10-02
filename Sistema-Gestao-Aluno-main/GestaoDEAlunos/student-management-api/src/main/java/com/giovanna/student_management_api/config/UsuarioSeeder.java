package com.giovanna.student_management_api.config;

import com.giovanna.student_management_api.domain.entity.Usuario;
import com.giovanna.student_management_api.domain.enums.PerfilEnum;
import com.giovanna.student_management_api.domain.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;





@Component
public class UsuarioSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return;
        }


        usuarioRepository.save(new Usuario(null, "admin123", passwordEncoder.encode("Admin1234"), PerfilEnum.ADMINISTRADOR));
        usuarioRepository.save(new Usuario(null, "leitor123", passwordEncoder.encode("Leitor1234"), PerfilEnum.LEITOR));
    }
}