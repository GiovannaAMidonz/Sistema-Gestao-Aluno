package com.giovanna.student_management_api.domain.repository;

import com.giovanna.student_management_api.domain.entity.Aluno;
import com.giovanna.student_management_api.domain.enums.StatusAlunosEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    boolean existsByCpf(String cpf);

    boolean existsByEmailIgnoreCaseAndUsuarioExcluidoFalse(String email);

    boolean existsByEmailIgnoreCaseAndUsuarioExcluidoFalseAndIdNot(String email, Long id);

    Optional<Aluno> findByIdAndUsuarioExcluidoFalse(Long id);

    @Query("""
            SELECT a FROM Aluno a
            WHERE a.usuarioExcluido = false
              AND (:status IS NULL OR a.status = :status)
              AND (
                    :busca IS NULL OR :busca = ''
                    OR LOWER(a.nomeCompleto) LIKE LOWER(CONCAT('%', :busca, '%'))
                    OR a.matricula LIKE CONCAT(:busca, '%')
                  )
            """)
    Page<Aluno> buscar(@Param("busca") String busca,
                       @Param("status") StatusAlunosEnum status,
                       Pageable pageable);
}