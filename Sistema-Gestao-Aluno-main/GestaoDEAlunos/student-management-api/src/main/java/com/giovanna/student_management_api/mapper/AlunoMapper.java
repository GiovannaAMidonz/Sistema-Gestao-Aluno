package com.giovanna.student_management_api.mapper;

import com.giovanna.student_management_api.domain.entity.Aluno;
import com.giovanna.student_management_api.web.dto.AlunoResponseDTO;

public class AlunoMapper {

    public static AlunoResponseDTO toResponseDTO(
            Aluno aluno
    ) {
        return new AlunoResponseDTO(aluno);
    }
}

