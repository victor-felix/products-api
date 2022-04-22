# Products API

API construída em Node para gerenciar a base de produtos da Growth Hackers

## Instalar

### Pré-requisitos

Para iniciar o projeto você precisar ter a seguinte configuração:

- Docker (https://docs.docker.com/engine/install/)
- Docker Compose (https://docs.docker.com/compose/install/)
- NodeJS v14.17.0

### Com o terminal na pasta do projeto, executar os seguintes comandos:

#### Docker

```bash
  docker-compose up -d
```

#### Dependências

```bash
  yarn install
```

#### Variaveis de ambiente

- Criar arquivo .env na pasta /env com o seguinte conteúdo:

```
ENVIRONMENT=dev

HTTP_HOST=localhost
HTTP_PORT=3333

DATABASE_TYPE=postgres
DATABASE_URL=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=usr_products_api
DATABASE_PASSWORD=kfSZgfyTbi0G
DATABASE_NAME=products_db
DATABASE_LOGGING=false
```

#### Iniciar aplicação

```bash
  yarn dev
```

## API Reference

### Listar productos

```http
  GET /api/v1/product
```

#### Parametros de query

| Parametro  | Tipo     | Descrição                                       |
| :--------- | :------- | :---------------------------------------------- |
| `name`     | `string` | **Opcional** - nome do produto                  |
| `tag_name` | `string` | **Opcional** - nome da categoria                |
| `tag_id`   | `string` | **Opcional** - id da categoria                  |
| `skip`     | `string` | **Opcional** - página da grid (default 1)       |
| `take`     | `string` | **Opcional** - quantidade de itens (default 10) |

### Exibir produto

```http
  GET /api/v1/product/:id
```

#### Parametros de rota

| Parametro | Tipo     | Descrição                      |
| :-------- | :------- | :----------------------------- |
| `id`      | `number` | **Obrigatório**. Id do produto |

### Cadastrar produto

```http
  POST /api/v1/product
```

#### Corpo da requisição

| Parametro  | Tipo     | Descrição                            |
| :--------- | :------- | :----------------------------------- |
| `name`     | `string` | **Obrigatório**. Nome do produto     |
| `tag`      | `object` | **Obrigatório**. Objeto da categoria |
| `tag.name` | `string` | **Obrigatório**. Nome da categoria   |

### Atualizar produto

```http
  PUT /api/v1/product/:id
```

#### Parametros de rota

| Parametro | Tipo     | Descrição                      |
| :-------- | :------- | :----------------------------- |
| `id`      | `number` | **Obrigatório**. Id do produto |

#### Corpo da requisição

| Parametro  | Tipo     | Descrição                            |
| :--------- | :------- | :----------------------------------- |
| `name`     | `string` | **Obrigatório**. Nome do produto     |
| `tag`      | `object` | **Obrigatório**. Objeto da categoria |
| `tag.name` | `string` | **Obrigatório**. Nome da categoria   |

### Deletar produto

```http
  DELETE /api/v1/product/:id
```

#### Parametros de rota

| Parametro | Tipo     | Descrição                      |
| :-------- | :------- | :----------------------------- |
| `id`      | `number` | **Obrigatório**. Id do produto |

### Listar categorias

```http
  GET /api/v1/tag
```

#### Parametros de query

| Parametro | Tipo     | Descrição                                       |
| :-------- | :------- | :---------------------------------------------- |
| `name`    | `string` | **Opcional** - nome da categoria                |
| `skip`    | `string` | **Opcional** - página da grid (default 1)       |
| `take`    | `string` | **Opcional** - quantidade de itens (default 10) |

### Exibir categoria

```http
  GET /api/v1/tag/:id
```

#### Parametros de rota

| Parametro | Tipo     | Descrição                        |
| :-------- | :------- | :------------------------------- |
| `id`      | `number` | **Obrigatório**. Id da categoria |

### Cadastrar categoria

```http
  POST /api/v1/tag
```

#### Corpo da requisição

| Parametro | Tipo     | Descrição                          |
| :-------- | :------- | :--------------------------------- |
| `name`    | `string` | **Obrigatório**. Nome da categoria |

### Atualizar categoria

```http
  PUT /api/v1/tag/:id
```

#### Parametros de rota

| Parametro | Tipo     | Descrição                        |
| :-------- | :------- | :------------------------------- |
| `id`      | `number` | **Obrigatório**. Id da categoria |

#### Corpo da requisição

| Parametro | Tipo     | Descrição                          |
| :-------- | :------- | :--------------------------------- |
| `name`    | `string` | **Obrigatório**. Nome da categoria |

### Deletar categoria

```http
  PUT /api/v1/tag/:id
```

#### Parametros de rota

| Parametro | Tipo     | Descrição                        |
| :-------- | :------- | :------------------------------- |
| `id`      | `number` | **Obrigatório**. Id do categoria |

### Exportar arquivo JSON contendo os produtos de uma categoria

```http
  GET /api/v1/tag/:id/products
```

#### Parametros de rota

| Parametro | Tipo     | Descrição                        |
| :-------- | :------- | :------------------------------- |
| `id`      | `number` | **Obrigatório**. Id do categoria |

### Importar arquivo JSON contendo os produtos de uma categoria

```http
  GET /api/v1/tag/:id/products
```

#### Parametros de rota

| Parametro | Tipo     | Descrição                        |
| :-------- | :------- | :------------------------------- |
| `id`      | `number` | **Obrigatório**. Id do categoria |

#### Conteúdo do arquivo

O arquivo deve conter um array de objetos que possuem a seguinte estrutura:

| Parametro | Tipo     | Descrição                        |
| :-------- | :------- | :------------------------------- |
| `name`    | `string` | **Obrigatório**. Nome do produto |

#### Parametros form-data

| Parametro | Tipo   | Descrição                                          |
| :-------- | :----- | :------------------------------------------------- |
| `file`    | `file` | **Obrigatório**. Arquivo JSON contendo os produtos |
