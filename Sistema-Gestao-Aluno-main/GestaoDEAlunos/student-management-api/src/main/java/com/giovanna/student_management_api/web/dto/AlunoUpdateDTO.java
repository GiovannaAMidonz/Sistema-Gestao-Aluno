package com.giovanna.student_management_api.web.dto;

import com.giovanna.student_management_api.domain.enums.StatusAlunosEnum;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlunoUpdateDTO {
    @NotBlank(message = "Nome completo e obrigatorio")
    @Size(min = 3, max = 120, message = "Nome deve ter entre 3 e 120 caracteres")
    private String nomeCompleto;


    @NotBlank(message = "E-mail deve ser OBRIGATÓRIO!")
    @Email(message = "E-mail invalido")
    private String email;

    @NotBlank(message = "celular é obrigatório")
    @Pattern(regexp = "\\d{10,11}", message = "Telefone deve conter DDD + numero (10 ou 11 digitos)")
    private String telefone;


    @NotNull(message = "Status é obrigatório")
    private StatusAlunosEnum status;

    private String fotoUrl;
}
