package com.giovanna.student_management_api.web.dto;

import com.giovanna.student_management_api.domain.entity.Aluno;
import com.giovanna.student_management_api.domain.enums.StatusAlunosEnum;
import lombok.Getter;
import lombok.Setter;

public record AlunoResponseDTO(
        Long id,
        String matricula,
        String nomeCompleto,
        String cpf,
        String email,
        String telefone,
        String fotoUrl,
        StatusAlunosEnum status
){
}






