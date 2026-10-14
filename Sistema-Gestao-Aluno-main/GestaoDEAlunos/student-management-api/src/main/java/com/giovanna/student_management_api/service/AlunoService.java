package com.giovanna.student_management_api.service;


import com.giovanna.student_management_api.domain.entity.Aluno;
import com.giovanna.student_management_api.domain.enums.StatusAlunosEnum;
import com.giovanna.student_management_api.domain.repository.AlunoRepository;
import com.giovanna.student_management_api.exception.AlunoNaoEncontradoException;
import com.giovanna.student_management_api.exception.ConflitoException;
import com.giovanna.student_management_api.web.dto.AlunoRequestDTO;
import com.giovanna.student_management_api.web.dto.AlunoResponseDTO;
import com.giovanna.student_management_api.web.dto.AlunoUpdateDTO;
import com.giovanna.student_management_api.web.dto.PageResponseDTO;
import com.giovanna.student_management_api.mapper.AlunoMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Year;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;

    public AlunoService(AlunoRepository alunoRepository)
    {
        this.alunoRepository = alunoRepository;
    }


    public PageResponseDTO<AlunoResponseDTO> listar(
            String busca,
            String status,
            int pagina,
            int tamanho,
            String ordenarPor,
            String direcao
    ) {
        StatusAlunosEnum statusFiltro = converterStatus(status);

        Sort.Direction direcaoOrdenacao =
                "desc".equalsIgnoreCase(direcao)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        String campoOrdenacao = (ordenarPor == null || ordenarPor.isBlank()) ? "nomeCompleto" : ordenarPor;

        PageRequest paginacao =
                PageRequest.of(
                        pagina,
                        tamanho,
                        Sort.by(direcaoOrdenacao, campoOrdenacao)
                );

        String buscaNormalizada = busca == null ? "" : busca.trim();

        Page<Aluno> resultado =
                alunoRepository.buscar(
                        buscaNormalizada,
                        statusFiltro,
                        paginacao
                );

        return new PageResponseDTO<>(
                resultado.map(AlunoMapper::toResponseDTO)
        );
       /*
        1 Recebe filtros
        2 Monta a paginação
        3 Chama o Repository
        4 Converte Entity → DTO*/
    }

    public AlunoResponseDTO buscarPorId(Long id){
        return AlunoMapper.toResponseDTO(buscarAlunoVigente(id));
    }

    public AlunoResponseDTO cadastrar(AlunoRequestDTO dto){
        String cpfSomenteDigitos = dto.getCpf().replaceAll("\\D","");

        String telefoneSomenteDigitos = dto.getTelefone().replaceAll("\\D","");

        String emailNormalizado = dto.getEmail().trim().toLowerCase();
        /* tem que ver se o cpf do aluno excluído se enquadra na lógica*/
        if(alunoRepository.existsByCpf(cpfSomenteDigitos)){
            throw new ConflitoException("Já existe um aluno cadastrado com este CPF.");
        }


        if(alunoRepository.existsByEmailIgnoreCaseAndUsuarioExcluidoFalse(emailNormalizado)){
            throw new ConflitoException("Já existe um aluno cadastrado com este e-mail.");
        }
        Aluno aluno = Aluno.builder()
                .matricula(gerarMatricula())
                .nomeCompleto(dto.getNomeCompleto().trim())
                .cpf(cpfSomenteDigitos)
                .email(emailNormalizado)
                .telefone(telefoneSomenteDigitos)
                .fotoUrl(dto.getFotoUrl())
                .status(StatusAlunosEnum.ATIVO)
                .build();
        Aluno salvo = alunoRepository.save(aluno);
        return AlunoMapper.toResponseDTO(salvo);
    }


    public AlunoResponseDTO atualizar(Long id, AlunoUpdateDTO dto) {
        Aluno aluno = buscarAlunoVigente(id);

        String emailNormalizado = dto.getEmail().trim().toLowerCase();

        if (alunoRepository.existsByEmailIgnoreCaseAndUsuarioExcluidoFalseAndIdNot(emailNormalizado, id)) {
            throw new ConflitoException("Já existe outro aluno cadastrado com este e-mail.");
        }

        aluno.setNomeCompleto(dto.getNomeCompleto().trim());
        aluno.setEmail(emailNormalizado);
        aluno.setTelefone(dto.getTelefone().replaceAll("\\D", ""));
        aluno.setFotoUrl(dto.getFotoUrl());
        aluno.setStatus(dto.getStatus());
        //aluno.setAtualizadoEm(LocalDateTime.now());

        Aluno salvo = alunoRepository.save(aluno);
        return AlunoMapper.toResponseDTO(salvo);
    }



    public void excluir(Long id) {

        Aluno aluno = buscarAlunoVigente(id);

        aluno.setUsuarioExcluido(true);
        aluno.setDataExclusao(LocalDateTime.now());
        aluno.setAtualizadoEm(LocalDateTime.now());

        alunoRepository.save(aluno);
    }

    public void restaurar(Long id) {

        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new AlunoNaoEncontradoException(id));

                aluno.setUsuarioExcluido(false);
                aluno.setDataExclusao(null);
                aluno.setAtualizadoEm(LocalDateTime.now());

                alunoRepository.save(aluno);
    }

    private Aluno buscarAlunoVigente(Long id) {
        return alunoRepository.findByIdAndUsuarioExcluidoFalse(id)
                .orElseThrow(() -> new AlunoNaoEncontradoException(id));
    }

    private StatusAlunosEnum converterStatus(String status) {
        if (status == null || status.isBlank() || "TODOS".equalsIgnoreCase(status)) {
            return null;
        }
        return StatusAlunosEnum.valueOf(status.toUpperCase());
    }

    private String gerarMatricula(){

        long proximoSequencial = alunoRepository.count() + 1;
        int ano = Year.now().getValue();
        return String.format("%d%03d", ano, proximoSequencial);
    }

    public PageResponseDTO<AlunoResponseDTO> listarExcluidos(
            String busca,
            int pagina,
            int tamanho,
            String ordenarPor,
            String direcao
    ) {

        Sort.Direction direcaoOrdenacao =
                "desc".equalsIgnoreCase(direcao)
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        String campoOrdenacao = (ordenarPor == null || ordenarPor.isBlank()) ? "nomeCompleto" : ordenarPor;

        PageRequest paginacao =
                PageRequest.of(
                        pagina,
                        tamanho,
                        Sort.by(direcaoOrdenacao, campoOrdenacao)
                );

        String buscaNormalizada = busca == null ? "" : busca.trim();

        Page<Aluno> resultado =
                alunoRepository.buscarExcluidos(
                        buscaNormalizada,
                        paginacao
                );

        return new PageResponseDTO<>(
                resultado.map(AlunoMapper::toResponseDTO)
        );
    }
}