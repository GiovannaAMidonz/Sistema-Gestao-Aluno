package com.giovanna.student_management_api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;






@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:testdb")
@AutoConfigureMockMvc
class SegurancaTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String ALUNO_VALIDO = """
            {"nomeCompleto":"Nome Alterado","email":"amanda.freitas@email.com",
             "telefone":"11990000000","status":"ATIVO"}
            """;

    @Test
    void semLogin_deveResponder401() throws Exception {
        mockMvc.perform(get("/api/alunos")).andExpect(status().isUnauthorized());
    }

    @Test
    void senhaErrada_deveResponder401() throws Exception {
        mockMvc.perform(get("/api/auth/me").with(httpBasic("admin123", "SenhaErrada1")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginValido_devolvePerfil() throws Exception {
        mockMvc.perform(get("/api/auth/me").with(httpBasic("admin123", "Admin1234")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.perfil").value("ADMINISTRADOR"));
    }

    @Test
    void leitorPodeListar() throws Exception {
        mockMvc.perform(get("/api/alunos").with(httpBasic("leitor123", "Leitor1234")))
                .andExpect(status().isOk());
    }

    @Test
    void leitorNaoPodeEditar_deveResponder403_semAlterarBanco() throws Exception {
        mockMvc.perform(put("/api/alunos/1").with(httpBasic("leitor123", "Leitor1234"))
                        .contentType(MediaType.APPLICATION_JSON).content(ALUNO_VALIDO))
                .andExpect(status().isForbidden());


        mockMvc.perform(get("/api/alunos/1").with(httpBasic("admin123", "Admin1234")))
                .andExpect(jsonPath("$.nomeCompleto").value("Amanda Freitas"));
    }

    @Test
    void adminPodeExcluir() throws Exception {
        mockMvc.perform(delete("/api/alunos/2").with(httpBasic("admin123", "Admin1234")))
                .andExpect(status().isNoContent());
    }
}