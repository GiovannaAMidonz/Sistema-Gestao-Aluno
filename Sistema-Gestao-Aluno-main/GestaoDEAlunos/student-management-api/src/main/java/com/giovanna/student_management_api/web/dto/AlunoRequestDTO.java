package com.giovanna.student_management_api.web.dto;


import com.giovanna.student_management_api.domain.enums.StatusAlunosEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlunoRequestDTO{

        @NotBlank(message = "Nome completo e obrigatorio")
        @Size(min = 3, max = 120, message = "Nome deve ter entre 3 e 120 caracteres")
        private String nomeCompleto;


        @NotBlank(message = "CPF É OBRIGATÓRIO")
        @Pattern(regexp = "\\d{11}", message = "CPF deve conter os 11 digitos numericos ")
        private String cpf;

        @NotBlank(message = "E-mail deve ser OBRIGATÓRIO!")
        @Email(message = "E-mail invalido")
        private String email;

        @NotBlank(message = "celular é obrigatório")
        @Pattern(regexp = "\\d{10,11}", message = "Telefone deve conter DDD + numero (10 ou 11 digitos)")
        private String telefone;

        private String fotoUrl;

        private StatusAlunosEnum status;

}