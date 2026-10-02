package com.giovanna.student_management_api.web.dto;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class PageResponseDTO<T> {

    private final List<T> conteudo;
    private final int paginaAtual;
    private final int tamanhoPagina;
    private final long total;
    private final int totalPaginas;

    public PageResponseDTO(Page<T> page){
        this.conteudo = page.getContent();
        this.paginaAtual = page.getNumber();
        this.tamanhoPagina = page.getSize();
        this.total = page.getTotalElements();
        this.totalPaginas = page.getTotalPages();
    }
}
