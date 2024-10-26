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

Este é um projeto de codigo aberto que tem como base a biblioteca [ThunderPix](https://www.npmjs.com/package/thunderpix) que padroniza as APIs dos maiores provedores e gateways de pagameto nacionais. O projeto tem como objetivo, fornecer uma interface simples para desenvolvimento de aplicações q utilizem uma das [APIs listadas](https://github.com/vhratts/thunderpix?tab=readme-ov-file#provedores-de-pagamento-suportados)

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
| Banco Primepag          | Primepag         | pix     | `api/Primepag/pix`    |
| Mercado Pago SA         | MercadoPago      | pix     | `api/MercadoPago/pix` |
| PicPay SA               | PicPay           | pix     | `api/PicPay/pix`      |
| Pagar-me                | Pagarme          | pix     | `api/Pagarme/pix`     |
| OpenPix SA              | OpenPix          | pix     | `api/OpenPix/pix`     |
| Cielo                   | Cielo            | pix     | `api/Cielo/pix`       |
| Asaas                   | Asaas            | pix     | `api/Asaas/pix`       |
| Zendry                  | Zendry           | pix     | `api/Zendry/pix`      |

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

```js
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

## Buscando QrCode

Caso precise buscar / consultar um QrCode gerado, utilize a chave de referência ou ```code``` gerado pelo seu provedor de pagamento. 

Para Efetuar uma consulta de QrCode, efetue uma chamada ```GET``` passando como parametro **query** a chave ```reference``` com valor ```code```.


```js
import axios from "axios";

(async () => {
  var { data } = await axios.get(
    "http://localhost:3000/api/[provider]/[method]/read/qrcodes?reference=kk6g232xel65a0daee4dd13kk4000119195",
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

O retorno esperado da chamada caso o pagamento ainda não tenha sido processado:

```js
{
  "referenceCode": "kk6g232xel65a0daee4dd13kk4000119195",
  "valueCents": 5945,
  "content": "00020126870014br.gov.bcb....",
  "status": "awaiting_payment",
  "generatorName": null,
  "generatorDocument": null,
  "payerName": null,
  "payerDocument": null,
  "payerBankName": null,
  "payerAgency": null,
  "payerAccount": null,
  "payerAccountType": null,
  "registrationDate": "2024-10-20T13:22:59.000-03:00",
  "paymentDate": null,
  "endToEnd": null
}
```

O retorno esperado da chamada após o pagamento ter sido processado:

```js
{
  "referenceCode": "kk6g232xel65a0daee4dd13kk4000119195",
  "valueCents": 5945,
  "content": "00020126870014br.gov.bcb....",
  "status": "complete",
  "generatorName": "Victor...Ratts",
  "generatorDocument": "057...60",
  "payerName": "Roberto...Silva",
  "payerDocument": "018...50",
  "payerBankName": "Nubank SA",
  "payerAgency": "0001",
  "payerAccount": "023...99",
  "payerAccountType": "debit",
  "registrationDate": "2024-10-20T13:22:59.000-03:00",
  "paymentDate": "2024-10-20T13:31:20.000-03:00",
  "endToEnd": "0221aca45c4a41b46bf8cda8c18a74"
}
```

## Listando Transações

### QrCodes (entradas)

Para listar os QrCodes Gerados pelo provedor de pagamento, é necessario efetuar uma chamada `GET` simples passando as credenciais de autenticação do seu provedor.

> - IMPORTANT: Sempre passe a flag "type" como "input" caso queira oter apenas as transações de entrada.

```js
import axios from "axios";

(async () => {
  var { data } = await axios.get(
    "http://localhost:3000/api/[provider]/[method]/read/transactions?type=input",
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

> Se precisar de um filtro mais especifico, como filtro de data por exemplo, você pode efetuar uma chamada `POST` para a mesma rota, passando como corpo:

```json
{
  "page": 1, // Numero da pagina consultada.
  "registrationDateStart": "2024-10-01T00:00:00Z", // Data/hora inicial do filtro em Formato ISO.
  "registrationDateEnd": "2024-10-24T00:00:00Z" // Data/hora final do filtro em Formato ISO.
}
```

A chamada retorna um json com um array contendo os itens solicitados pela consulta.

```js
[
  // ...
  {
    referenceCode: "5dda700c96475b8...",
    valueCents: 4999,
    content: "00020126870014br.gov.bcb....",
    status: "awaiting_payment", // Os metodos de status variam de provedor para provedor.
    generatorName: null,
    generatorDocument: null,
    payerName: null,
    payerDocument: null,
    registrationDate: "2024-10-20T13:22:59.000-03:00",
    paymentDate: null,
    endToEnd: null,
  },
  // ...
];
```

### Pagamentos (saídas)

Para listar as saídas, saques ou retiradas gerados pelo provedor de pagamento, é necessario efetuar uma chamada `GET` simples passando as credenciais de autenticação do seu provedor.

> - IMPORTANT: Sempre passe a flag "type" como "output" caso queira oter apenas as transações de saída.

```js
import axios from "axios";

(async () => {
  var { data } = await axios.get(
    "http://localhost:3000/api/[provider]/[method]/read/transactions?type=output",
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

> Se precisar de um filtro mais especifico, como filtro de data por exemplo, você pode efetuar uma chamada `POST` para a mesma rota, passando como corpo:

```json
{
  "page": 1, // Numero da pagina consultada.
  "registrationDateStart": "2024-10-01T00:00:00Z", // Data/hora inicial do filtro em Formato ISO.
  "registrationDateEnd": "2024-10-24T00:00:00Z" // Data/hora final do filtro em Formato ISO.
}
```

A chamada retorna um json com um array contendo os itens solicitados pela consulta.

```js
[
  // ...
  {
    referenceCode: "5dda700c96475b8...",
    valueCents: 4999,
    content: "00020126870014br.gov.bcb....",
    status: "awaiting_payment", // Os metodos de status variam de provedor para provedor.
    generatorName: null,
    generatorDocument: null,
    payerName: null,
    payerDocument: null,
    registrationDate: "2024-10-20T13:22:59.000-03:00",
    paymentDate: null,
    endToEnd: null,
  },
  // ...
];
```

## Saque / Retirada (saídas)

> - IMPORTANTE: Essa funcionalidade depende do provedor de pagamento que voce escolher. alguns provedores não suportam a função de `Saque` ou `Transferência` por API. Portanto, considere colsultar [a tabela de provedores e suporte](https://github.com/vhratts/thunderpix?tab=readme-ov-file#provedores-de-pagamento-suportados) para saer se seu provedor suporta essa função

Para efetuar um saque, trasferência ou retirada a partir do provedor de sua escolha,
efetue uma chamada `POST` passando no corpo, as informações para o saque.

```js
import axios from "axios";

(async () => {
  var { data } = await axios.post(
    "http://localhost:3000/api/[provider]/[method]/create/transaction",
    {
      initiationType: "dict", // escolha entre 'dict' para automatico ou 'manual'
      idempotentId: "67017be8-...-e687aa450cfd", // Chave ou codigo unico gerado pelo seu sistem
      valueCents: 1400, // Valor em centavos que deseja transferir (R$ 14,00)
      receiverName: "Victor ... Ratts", // Nome do beneficiario
      receiverDocument: "057...60", // Documento do beneficiario
      pixKeyType: "cpf", // tipo do documento
      pixKey: "057...60", // chave PIX
      authorized: true, // Autorização automatica (Caso seu provedor suporte)
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

Caso tudo tenha ocorrido certo, chamada executa a seguinte resposta:

```json
{
  "idempotent_id": "67017be8-8f88-8001-8b65-e687aa450cfd",
  "value_cents": 1400,
  "receiver_name": "Victor...Ratts",
  "receiver_document": "057...60",
  "pix_key": "057...60",
  "pix_key_type": "cpf",
  "reference_code": "PE2024...96942",
  "status": "completed"
}
```

# Contato

Desenvolvedor: Victor Ratts <br>
Email: victor@vratts.com <br>
site: vratts <br>

### Me pague um café ☕️ 🙏

Pix: 91b7482c-3ef1-4eff-8d80-9a59c87773a8
