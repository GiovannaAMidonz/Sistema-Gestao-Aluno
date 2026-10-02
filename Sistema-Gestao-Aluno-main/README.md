<div align="center">

# Sistema de Gestão de Alunos

Aplicação Full Stack para gerenciamento de alunos, desenvolvida como desafio técnico utilizando Spring Boot e Angular.



## Tecnologias Utilizadas

<table>
<tr>
<td valign="top">

### Backend

| Tecnologia | Descrição |
|------------|-----------|
| Java 25 | Linguagem principal da aplicação |
| Spring Boot 3 | Framework backend |
| Spring Data JPA | Persistência de dados |
| Spring Security | Autenticação e autorização |
| H2 Database | Banco de dados |
| Hibernate | ORM |
| Maven | Gerenciador de dependências |
| Lombok | Redução de código boilerplate |

</td>
<td valign="top">

### Frontend

| Tecnologia | Descrição |
|------------|-----------|
| Angular 20 | Framework frontend |
| TypeScript | Linguagem principal |
| RxJS | Programação reativa |
| Angular Router | Gerenciamento de rotas |
| Angular Forms | Criação e validação de formulários |

</td>
</tr>
</table>
</div>

---
## Estrutura do Projeto

```text
Sistema-Gestao-Alunos
│
├── student-management-api
│   ├── src
│   └── pom.xml
│
└── sistema-gestao-alunos
    ├── src
    ├── package.json
    └── angular.json
```

## Como Executar o Projeto
### Pré-requisitos

Antes de iniciar o projeto, certifique-se de possuir instalado:

- Java 25
- Maven 3.9+
- Node.js 22+
- Angular CLI 20
- Git

---

### Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd Sistema-Gestao-Alunos
```

---

## Executando o Backend

Acesse a pasta do backend:

```bash
cd student-management-api
```

Execute a aplicação:

```bash
mvn spring-boot:run
```

Ou execute a classe principal pelo IntelliJ IDEA:

```java
StudentManagementApiApplication
```

A API ficará disponível em:

```text
http://localhost:8080
```

---

## Banco de Dados H2

Acesse:

```text
http://localhost:8080/h2-console
```

Utilize as seguintes configurações:

```text
JDBC URL: jdbc:h2:file:./data/alunodb
User: sa
Password:
```

---

## Executando o Frontend

Abra um novo terminal e acesse a pasta do frontend:

```bash
cd sistema-gestao-alunos
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
ng serve
```
ou

```bash
npx ng serve
```

A aplicação ficará disponível em:

```text
http://localhost:4200
```

Caso a porta 4200 esteja ocupada, o Angular sugerirá automaticamente outra porta.

---

## Fluxo de Inicialização

1. Inicie o Backend Spring Boot.
2. Verifique se a API está disponível em:

```text
http://localhost:8080
```

3. Inicie o Frontend Angular.
4. Acesse:

```text
http://localhost:4200
```

5. Realize o login para acessar o sistema.

---

## Funcionalidades Implementadas

- Autenticação de usuários
- Listagem de alunos
- Busca por nome
- Busca por matrícula
- Filtro por status
- Paginação
- Cadastro de alunos
- Atualização de alunos
- Inativação de alunos
- Controle de acesso por perfil

---

## Perfis de Acesso

### ADMINISTRADOR

- Consultar alunos
- Cadastrar alunos
- Editar alunos
- Inativar alunos

### LEITOR

- Consultar alunos
- Visualizar detalhes dos alunos

### Usuários para login

Ao iniciar o back-end, dois usuários são criados automaticamente:

| Perfil | Usuário | Senha |
|---|---|---|
| ADMINISTRADOR | `admin123` | `Admin1234` |
| LEITOR | `leitor123` | `Leitor1234` |


---
<div align="center">

### 🚀 Sistema de Gestão de Alunos

Backend em Spring Boot • Frontend Angular • H2 Database • Spring Security

Desenvolvido por **Giovanna Souza**

⭐ Obrigado por visitar este projeto!

</div>
    
