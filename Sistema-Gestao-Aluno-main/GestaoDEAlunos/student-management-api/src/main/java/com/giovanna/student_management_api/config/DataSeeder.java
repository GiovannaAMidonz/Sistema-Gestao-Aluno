package com.giovanna.student_management_api.config;

import com.giovanna.student_management_api.domain.entity.Aluno;
import com.giovanna.student_management_api.domain.enums.StatusAlunosEnum;
import com.giovanna.student_management_api.domain.repository.AlunoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final String[] NOMES = {
            "Amanda Freitas", "Ana Oliveira", "Beatriz Lima", "Bruno Ribeiro", "Carlos Souza",
            "Camila Santos", "Daniel Costa", "Diana Almeida", "Eduardo Pereira", "Fernanda Rocha",
            "Gabriel Martins", "Helena Barbosa", "Igor Nascimento", "Julia Carvalho", "Lucas Gomes",
            "Mariana Dias", "Nathan Correia", "Otavio Teixeira", "Patricia Vieira", "Rafael Andrade",
            "Sabrina Moura", "Thiago Cardoso", "Vitoria Ramos", "William Duarte", "Yasmin Azevedo",
            "Alice Monteiro", "Bernardo Pinto", "Clara Farias"
    };

    private final AlunoRepository alunoRepository;

    public DataSeeder(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    @Override
    public void run(String... args) {
        if (alunoRepository.count() > 0) {
            return;
        }

        for (int i = 0; i < NOMES.length; i++) {
            String matricula = String.format("2024%03d", i + 1);
            String cpf = String.format("%011d", 10000000000L + i);
            String email = NOMES[i].toLowerCase().replace(" ", ".") + "@email.com";
            String telefone = String.format("119900%05d", i);


            StatusAlunosEnum status = (i % 4 == 0) ? StatusAlunosEnum.INATIVO : StatusAlunosEnum.ATIVO;

            Aluno aluno = new Aluno(matricula, NOMES[i], cpf, email, telefone, null, status);
            alunoRepository.save(aluno);
        }
    }
}
