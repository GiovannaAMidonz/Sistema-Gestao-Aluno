package com.giovanna.student_management_api.exception;

public class ConflitoException extends RuntimeException {
    public ConflitoException(String mensage){
        super(mensage);
    }
}
