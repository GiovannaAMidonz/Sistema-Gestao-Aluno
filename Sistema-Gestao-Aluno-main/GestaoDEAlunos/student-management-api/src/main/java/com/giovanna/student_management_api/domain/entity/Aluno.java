package com.giovanna.student_management_api.domain.entity;

import com.giovanna.student_management_api.domain.enums.StatusAlunosEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;



@Entity
@Table(name = "alunos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aluno {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String matricula;

    @Column(name = "nomeCompleto", nullable = false, length = 120)
    private String nomeCompleto;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false, length = 11)
    private String telefone;

    @Lob
    @Column(name = "foto_url", length = 255)
    private String fotoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StatusAlunosEnum status;

    @Builder.Default
    @Column(name = "usuario_excluido", nullable = false)
    private boolean usuarioExcluido = false;


    @Column(name = "data_exclusao")
    private LocalDateTime dataExclusao;

    private LocalDateTime atualizadoEm;

    @PrePersist
    public void prePersist() {
        this.atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }
}