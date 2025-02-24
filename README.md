# Teste Corebiz

### [Instruções](./challenge.md)

</br>

Um desafio técnico proposto pelo time da Corebiz que consiste em desenvolver uma api rest para o gerenciamento de tarefas. A aplicação deve ser capaz de registrar, alterar, listar e deletar tarefas de diferentes usuários.

### Tecnologias

 - NodeJS
 - Express
 - Javascript
 - PostgreSQL
 - Prisma
 - Docker
 - Swagger
 - Jest

### Como executar

Para rodar a aplicação é necessário ter o [Docker](https://docs.docker.com/engine/install/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

Após clonar o repositório, entre na pasta raiz e crie um novo arquivo .env com base em example.env e atribua novas variáves se necessário.
Para rodar a api abra o terminal e execute
```bash
docker-compose up
```

> Por padrão a porta **3001** será usada.

### Documentação da API

A API está documentada com Swagger e pode ser acessada localmente após a inicialização do servidor.

#### Acessando a documentação

1. Inicie a aplicação (caso ainda não tenha feito isso):
```bash
docker-compose up
```
2. Acesse a URL no navegador:
```bash
http://localhost:3001/api-docs
```
Isso abrirá uma interface interativa onde você pode visualizar os endpoints disponíveis e testar requisições diretamente pelo navegador.

### Arquitetura

Optou-se pela metodolgia em camadas com separação em Controllers, Services e Model, sendo a camada de Model administrada pelo Prisma ORM.

- `/src/routes/index.js`: é o arquivo que deverá agrupar todas as rotas através de importações

- `/src/routes`: é a pasta que contém os arquivos com cada rota. Os arquivos de rotas são agrupadas por endpoint, sendo os diferentes métodos presentes no mesmo arquivo. Ex.: a rota `DELETE /task` e `POST /task` devem estar dentro do arquivo `task.routes.js`

- `/src/controllers`: os controllers devem chamar a camada de service e devolver a resposta para o usuário

- `/src/services`: as services devem aplicar as regras de negócio existente e chamar a camada de model

- `/primsa/schema.prisma`: a camada de model é administrada pelo Prisma, sendo assim, esse arquivo deve conter o espelho do banco utilizado

### Testes

Para facilitar a execução dos testes dentro do container, foi criado um script .sh. Basta rodar:
```bash
./run-tests.sh
```

Caso prefira executar manualmente:
1. Acesse o container do backend:
```bash
docker compose exec backend sh
```

2. Execute os testes:
```bash
npm run test
```
#### Testes disponíveis

- Testes unitários: Cobrem as camadas de services Jest.

### Backlog

Próximas etapas e pontos a serem melhoradas

 1.  [ ] Desenvolvimento de testes unitários para a camada de routes controllers.
 2.  [ ] Desenvolvimento de testes de integração usando Cypress.