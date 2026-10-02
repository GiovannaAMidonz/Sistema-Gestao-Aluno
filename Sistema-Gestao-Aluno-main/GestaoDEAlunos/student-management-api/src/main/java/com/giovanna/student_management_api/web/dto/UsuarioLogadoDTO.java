package com.giovanna.student_management_api.web.dto;


import com.giovanna.student_management_api.domain.enums.PerfilEnum;

public record UsuarioLogadoDTO(
        String username,
        PerfilEnum perfil) {
}
