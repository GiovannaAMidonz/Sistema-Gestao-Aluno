package com.giovanna.student_management_api.web.controller;

import com.giovanna.student_management_api.domain.entity.Usuario;
import com.giovanna.student_management_api.domain.repository.UsuarioRepository;
import com.giovanna.student_management_api.web.dto.UsuarioLogadoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }



    @GetMapping("/me")
    public ResponseEntity<UsuarioLogadoDTO> me(Authentication authentication) {
        Usuario usuario = usuarioRepository.findByUsername(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(new UsuarioLogadoDTO(usuario.getUsername(), usuario.getPerfil()));
    }
}