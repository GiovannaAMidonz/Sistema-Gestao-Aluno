package com.giovanna.student_management_api.exception;

public class AlunoNaoEncontradoException extends RuntimeException {
    public AlunoNaoEncontradoException(Long id) {
        super("Aluno com id" + id + " não encontrado");
    }

}
