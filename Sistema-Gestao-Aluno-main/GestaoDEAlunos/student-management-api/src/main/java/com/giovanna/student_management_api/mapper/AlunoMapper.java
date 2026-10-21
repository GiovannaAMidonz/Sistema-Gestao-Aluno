package com.giovanna.student_management_api.mapper;

import com.giovanna.student_management_api.domain.entity.Aluno;
import com.giovanna.student_management_api.web.dto.AlunoResponseDTO;
import org.springframework.stereotype.Component;


public class AlunoMapper {

    public static AlunoResponseDTO toResponseDTO(
            Aluno aluno
    ) {
        return new AlunoResponseDTO(
                aluno.getId(),
                aluno.getMatricula(),
                aluno.getNomeCompleto(),
                aluno.getCpf(),
                aluno.getEmail(),
                aluno.getTelefone(),
                aluno.getFotoUrl(),
                aluno.getStatus(),
                aluno.getDataExclusao()
        );
    }


}
