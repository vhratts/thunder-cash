<p align="center">
<a href="#" target="_blank" style="display: flex; justify-content: center;">
<img src="app.png" width="400" alt="logo" style="width: 80px;">
</a>
</p>

<p align="center">
<a href="#" style="font-size: 30px;">💰 ThunderCash</a>
</p>

<p align="center">
<img src="https://img.shields.io/badge/env-NextJs-black" alt="build">
<img src="https://img.shields.io/badge/V1.0.1-gray" alt="test">
<img src="https://img.shields.io/badge/test-pass-geen" alt="test">
</p>

<p align="center">
API para padronização de provedores de pagamentos PiX
</p>

## introdução

Este é um projeto de codigo aberto que tem como base a bilioteca [ThunderPix](https://www.npmjs.com/package/thunderpix) que padroniza as APIs dos maiores provedores e gateways de pagameto nacionais. O projeto tem como objetivo, fornecer uma interface simples para desenvolvimento de aplicações q utilizem uma das [APIs listadas](https://github.com/vhratts/thunderpix?tab=readme-ov-file#provedores-de-pagamento-suportados)

## Instalação

Este serviço de API está construido em NextJs na versão 14.2. Recomendamos o deploy do serviço na [vercel](https://vercel.com). Caso ja tenha uma conta, basta fazer deploy clicando no botão abaixo.

<p align="center">
<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvhratts%2Fthunderpix">
<img src="https://vercel.com/button" alt="Deploy with Vercel"/>
</a>
</p>

Caso deseje executar em um ambiente de desenvolvimento, execute os seguntes comandos:

### Clone o repositorio

```bash
git clone https://github.com/vhratts/thunderpix.git
```

### Execute a instalação das dependencias

```bash
npm install
```

### Execute o servidor de desenvolvimento

```bash
npm run dev
```

Seguido os passos, a aplicação vai estar rodando no endereço `localhost:3000`

# Usando a API

Com o servidor no ar, é possivel acessar os endpoints da API.
Basicamente o servidor constroi o `provider` e `method` usando biblioteca `thunderpix`
conectado a Api nativa do provedor de pagamento e "modificando" a saída da API para um padrão.

> - AVISO: Nem todos os metodos e provedores estão devidamente listados. Consulte a [tabela de refêcia](https://github.com/vhratts/thunderpix?tab=readme-ov-file#provedores-de-pagamento-suportados) da biblioteca para saber se o metodo ou provedor de pagamentos q deseja usar estão disponiveis.

## Preparando API

Cada provedor possui seu `metodo de autenticação` definido, o servidor `thunder-cash` apenas padroniza
o metodo de autenticação seja `Basic Auth`, `OAuth`, `JWT` entre outros.

Sempre que efetuar uma chamada, Seja `POST` ou `GET`, lembre-se de `passar as credenciais no cabeçalho`.

### Exemplo simples

No exemplo abaixo, vamos gerar um QrCode PIX de R$ 19.99 com javascript & axios.

```js
import axios from "axios";

(async () => {
  var { data } = await axios.post(
    "http://localhost:3000/api/Primepag/pix/create/qrcode",
    {
      valueCents: 1999, // se desejar, pode usar 19.99
      expires: 3600, // expira em 3600 segundos (Uma Hora)
    },
    {
      /**
       * Insira as credências do seu
       * provedor de pagamento
       */
      headers: {
        clientId: "ac536f63-...",
        clientSecret: "38da4a8d-...",
      },
    }
  );

  console.log(data);
})();
```

O retorno esperado é um JSON com as seguintes chaves:

```json
{
  "qrcode": "base64data:image/png;base64...", // imagem no formato Base64
  "pixkey": "00020101021226930014br.gov.bcb....", //Chave Pi Copia-e-cola
  "value": {
    "original": 41.55, // Valor solitado na request
    "cents": 4155, // Valor em centavos
    "fixed": "41.55", // Valor em ponto fixo (2)
    "float": 41.55 // Valor em ponto flutuante (8)
  },
  "expires": {
    "timestamp": 1729729729, // timestamp de expiração
    "dateTime": "24/10/2024, 00:28:49", // Data/Hora GMT-3
    "iso": "2024-10-24T00:28:49.000Z" // Data/Hora formato ISO
  },
  "code": "kk6g232xel65a0daee4dd13kk4000119195" // Codigo Unico
}
```

### Metodos, Rotas e Chamadas

O projeto mantem a simplicidade na construção das rotas. O desenho de chamadas
consiste em obter dinamicamente:

- Provedor de pagamento (provider)
- Metodo de pagamento (method)
- Metodo de chamada (create ou read)

Onde as rotas podem ser resumidas em:

```sh
# Requisição Metodo POST
# Chamas de modificam ou criam dados no provedor
http://localhost:3000/api/[provider]/[method]/create

# Requisição Metodo GET
# Chamadas de leitura ou consulta de dados
http://localhost:3000/api/[provider]/[method]/read

```

### Provedores (providers)

Lista de provedores suportados na versão mais atual

| Nome do provedor        | Slug do Provedor | Metodos | chamadas              |
| ----------------------- | ---------------- | ------- | --------------------- |
| Banco Central do Brasil | Bacem            | pix     | `api/Bacem/pix`       |
| Primepag                | Primepag         | pix     | `api/Primepag/pix`    |
| Mercado Pago SA         | MercadoPago      | pix     | `api/MercadoPago/pix` |
| PicPay SA               | PicPay           | pix     | `api/PicPay/pix`      |

> - IMPORTANTE: Ao decorrer do desenvolvimento deste serviço essa tabela pode ser modificada, adicionando ou removendo **Metodos e provedores de pagamento**

## Obtendo Balanço / Saldo disponível

Para obter o saldo de um provedor, basta efetuar a seguinte chamada:

```js
import axios from "axios";

(async () => {
  var { data } = await axios.get(
    "http://localhost:3000/api/[provider]/[method]/create/balance",
    {
      /**
       * Insira as credências do seu
       * provedor de pagamento.
       */
      headers: {
        /**
         * Chaves de autenticação aqui
         * utilize o formato de objeto chave: valor
         * em um dos formatos abaixo
         * - token
         * - basic
         * - clientid
         * - clientsecret
         * - pixkey
         */
        token: "7c5fsda1-...",
      },
    }
  );

  console.log(data);
})();
```

Retorno esperado da chamada:

```json
{
  "valueCents": 4155,
  "valueFloat": 41.55
}
```

## Gerando QrCode de cobrança PIX

Para gerar um novo QrCode de cobrança, efetue a seguinte chamada

```js
import axios from "axios";

(async () => {
  var { data } = await axios.post(
    "http://localhost:3000/api/[provider]/[method]/create/qrcode",
    {
      /**
       * Insira as credências do seu
       * provedor de pagamento.
       */

      valueCents: 5945, // R$ 59,45
      expires: 300, // Expira em 5 min
    },
    {
      headers: {
        /**
         * Chaves de autenticação aqui
         * utilize o formato de objeto chave: valor
         * em um dos formatos abaixo
         * - token
         * - basic
         * - clientid
         * - clientsecret
         * - pixkey
         */
        token: "7c5fsda1-...",
      },
    }
  );

  console.log(data);
})();
```

Retorno esperado da chamada:

```json
{
  "qrcode": "base64data:image/png;base64...", // imagem no formato Base64
  "pixkey": "00020101021226930014br.gov.bcb....", //Chave Pi Copia-e-cola
  "value": {
    "original": 59.45, // Valor solitado na request
    "cents": 5945, // Valor em centavos
    "fixed": "59.45", // Valor em ponto fixo (2)
    "float": 59.45 // Valor em ponto flutuante (8)
  },
  "expires": {
    "timestamp": 1729729729, // timestamp de expiração
    "dateTime": "24/10/2024, 00:28:49", // Data/Hora GMT-3
    "iso": "2024-10-24T00:28:49.000Z" // Data/Hora formato ISO
  },
  "code": "kk6g232xel65a0daee4dd13kk4000119195" // Codigo Unico
}
```

# Contato

Desenvolvedor: Victor Ratts <br>
Email: victor@vratts.com <br>
site: vratts <br>

### Me pague um café ☕️ 🙏

Pix: 91b7482c-3ef1-4eff-8d80-9a59c87773a8
