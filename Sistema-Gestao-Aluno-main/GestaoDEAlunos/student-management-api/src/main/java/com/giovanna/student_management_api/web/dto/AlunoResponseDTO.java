package com.giovanna.student_management_api.web.dto;

import com.giovanna.student_management_api.domain.entity.Aluno;
import com.giovanna.student_management_api.domain.enums.StatusAlunosEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlunoResponseDTO{
    private final Long id;
    private final String matricula;
    private final String nomeCompleto;
    private final String cpf;
    private final String email;
    private final String telefone;
    private final String fotoUrl;
    private final StatusAlunosEnum status;

    public AlunoResponseDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.matricula = aluno.getMatricula();
        this.nomeCompleto = aluno.getNomeCompleto();
        this.cpf = aluno.getCpf();
        this.email = aluno.getEmail();
        this.telefone = aluno.getTelefone();
        this.fotoUrl = aluno.getFotoUrl();
        this.status = aluno.getStatus();
    }
}






