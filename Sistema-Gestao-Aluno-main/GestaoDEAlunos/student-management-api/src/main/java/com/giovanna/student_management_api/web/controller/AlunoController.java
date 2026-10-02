package com.giovanna.student_management_api.web.controller;

import com.giovanna.student_management_api.service.AlunoService;
import com.giovanna.student_management_api.web.dto.AlunoRequestDTO;
import com.giovanna.student_management_api.web.dto.AlunoResponseDTO;
import com.giovanna.student_management_api.web.dto.AlunoUpdateDTO;
import com.giovanna.student_management_api.web.dto.PageResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<AlunoResponseDTO>> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanho,
            @RequestParam(defaultValue = "nomeCompleto") String ordenarPor,
            @RequestParam(defaultValue = "asc") String direcao
    ) {

        return ResponseEntity.ok(
                alunoService.listar(
                        busca,
                        status,
                        pagina,
                        tamanho,
                        ordenarPor,
                        direcao
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> buscarPorID(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AlunoResponseDTO> cadastrar(
            @Valid @RequestBody AlunoRequestDTO dto
    ) {
        AlunoResponseDTO criado = alunoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AlunoUpdateDTO dto
    ) {
        return ResponseEntity.ok(alunoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        alunoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}