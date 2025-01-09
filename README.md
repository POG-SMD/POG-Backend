# Backend - Eollab Blog

## 📋 Sobre o Projeto

Este é o backend do Eollab Blog. Ele utiliza Node.js, Express e Prisma para gerenciar APIs RESTful, autenticação JWT e operações de banco de dados PostgreSQL. O projeto inclui documentação automática com Swagger e validações robustas com Yup.

---

## 📦 Dependências e para que servem

### Produção

- **[@prisma/client](https://www.prisma.io/)**: Cliente gerado pelo Prisma para interagir com o banco de dados.
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)**: Biblioteca para hash de senhas.
- **[cors](https://github.com/expressjs/cors)**: Middleware para lidar com políticas de CORS.
- **[dotenv](https://github.com/motdotla/dotenv)**: Carrega variáveis de ambiente de um arquivo `.env`.
- **[express](https://expressjs.com/)**: Framework web para criar rotas e middlewares.
- **[express-rate-limit](https://github.com/nfriedly/express-rate-limit)**: Middleware para limitar requisições por IP.
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)**: Para criação e validação de tokens JWT.
- **[swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)**: Gera documentação para APIs automaticamente com base em comentários.
- **[swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)**: Exibe a documentação gerada pelo Swagger.
- **[yup](https://github.com/jquense/yup)**: Para validações de objetos e schemas.

### Desenvolvimento

- **[jest](https://jestjs.io/)**: Framework para testes unitários.
- **[nodemon](https://nodemon.io/)**: Reinicia o servidor automaticamente em desenvolvimento.
- **[prisma](https://www.prisma.io/)**: ORM para trabalhar com o banco de dados.
- **[supertest](https://github.com/ladjs/supertest)**: Para testes de APIs REST.

---

## 🛠️ Estrutura de Arquivos

- **`index.js`**: Arquivo principal que inicia o servidor.
- **`server.js`**: Configurações do servidor Express, incluindo middlewares e rotas.
- **`prisma/schema.prisma`**: Modelo de dados usado pelo Prisma.
- **`.env.sample`**: Exemplo de variáveis de ambiente necessárias.

---

## ⚙️ Configuração do Ambiente

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.sample`:

```plaintext
PORT=3000
NODE_ENV=development
DB_PASSWORD=sua_senha
DB_PORT=5432
DB_USER=seu_usuario
DB_HOST=localhost
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/nome_do_banco
JWT_SECRET=sua_chave_secreta
```
---

### 2. Configurando o Banco no PgAdmin

1. Abra o **PgAdmin** e conecte-se ao servidor PostgreSQL.
2. Crie um novo banco de dados com o nome desejado.
3. Atualize a variável `DATABASE_URL` no arquivo `.env` com as credenciais do banco criado.  
   Exemplo:  
   ```plaintext
   DATABASE_URL=postgresql://postgres:senha@localhost:5432/meu_banco
   ```
4. Certifique-se de que o banco de dados esteja funcionando corretamente ao testar a conexão no PgAdmin.

---

### 3. Inicialize o Prisma

1. Execute o seguinte comando para sincronizar o schema do Prisma com o banco de dados:
   ```bash
   npx prisma db push
   ```
2. Para criar e aplicar migrações no banco de dados, execute:
   ```bash
   npx prisma generate
   ```
3. Após a migração, gere o cliente Prisma para interagir com o banco de dados:
   ```bash
   npx prisma migrate dev --name nome_da_migracao
   ```
4. Para abrir o Prisma Studio e gerenciar os dados, execute:
   ```bash
   npx prisma studio
   ```


### 4. Rodando o Servidor

1. Para iniciar o servidor em modo de desenvolvimento, use o seguinte comando
   ```bash
   npm run start:dev
   ```
2. Para rodar o servidor em produção, utilize:
   ```bash
   npm run start:prod
   ```
3. O servidor estará disponível no endereço, lá terá a documentação da API!:
   ```bash
   http://localhost:3000
   ```