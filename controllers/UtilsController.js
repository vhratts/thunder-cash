import ThunderPix, {
  MercadoPagoProvider,
  OpenPixProvider,
  PagarMeProvider,
  PicPayProvider,
  PixProvider,
  PrimepagProvider
} from "thunderpix";
import CieloPixProvider from "thunderpix/dist/providers/pix/CieloProvider";

/**
 * Utilitarios do sistema.
 * Funções de auxilio e
 * construção de dados
 */
export default {
  suportedProviders: [
    {
      id: 1,
      name: "Bacem",
      methods: ["pix"],
      provider: PixProvider,
      authType: "basic",
      authItens: ["pixkey"],
      info: new PixProvider({ pixkey: null }).providerInfo,
    },
    {
      id: 2,
      name: "Primepag",
      methods: ["pix"],
      provider: PrimepagProvider,
      authType: "basic",
      authItens: ["clientId", "clientSecret", "isTest"],
      info: new PrimepagProvider({ clientId: null, clientSecret: null })
        .providerInfo,
    },
    {
      id: 3,
      name: "MercadoPago",
      methods: ["pix"],
      provider: MercadoPagoProvider,
      authType: "basic",
      authItens: ["clientId", "clientSecret", "isTest"],
      info: new MercadoPagoProvider({
        clientId: null,
        clientSecret: null,
        isTest: true,
      }).providerInfo,
    },
    {
      id: 4,
      name: "PicPay",
      methods: ["pix"],
      provider: PicPayProvider,
      authType: "basic",
      authItens: ["token", "isTest"],
      info: new PicPayProvider({
        token: null,
        isTest: null,
      }).providerInfo,
    },
    {
      id: 5,
      name: "Pagarme",
      methods: ["pix"],
      provider: PagarMeProvider,
      authType: "basic",
      authItens: ["apiKey"],
      info: new PagarMeProvider({
        apiKey: null,
      }).providerInfo,
    },
    {
      id: 6,
      name: "Cielo",
      methods: ["pix"],
      provider: CieloPixProvider,
      authType: "basic",
      authItens: ["clientId", "clientSecret", "isTest"],
      info: new CieloPixProvider({
        clientId: null,
        clientSecret: null,
        isTest: true,
      }).providerInfo,
    },
    {
      id: 7,
      name: "OpenPix",
      methods: ["pix"],
      provider: OpenPixProvider,
      authType: "basic",
      authItens: ["apiKey", "isTest"],
      info: new OpenPixProvider({
        apiKey: null,
        isTest: true,
      }).providerInfo,
    },
  ],

  inputAdaptator: {
    clientId: ["clientid", "client_id", "clientId"],
    clientSecret: ["clientsecret", "client_secret", "clientSecret"],
    isTest: ["istest", "isTest"],
    token: ["token", "Token"],
    pixkey: ["pixKey", "pixkey", "PixKey"],
  },

  filterAdaptor(headers = {}) {
    var inputsKeys = Object.keys(this.inputAdaptator);
    var headerKeys = Object.keys(headers);

    // console.log(inputsKeys, headerKeys);

    var response = {};
    for (var data of inputsKeys) {
      for (var header of headerKeys) {
        if (this.inputAdaptator[data].includes(header)) {
          response[data] = headers[header];
        }
      }
    }

    return response;
  },

  HelperProvider(req) {
    var authKeys = this.filterAdaptor(req.headers);
    var gateway = this.suportedProviders
      .filter((value) => {
        if (value.name == req.query.provider) {
          if (value.methods.includes(req.query.method)) {
            return true;
          }
        }

        return false;
      })
      .map((mp) => {
        for (var item of mp.authItens) {
          mp[item] = req.headers[item];
        }

        return mp;
      })[0];

    var ConstructProvider = new gateway.provider(authKeys);

    return new ThunderPix(ConstructProvider);
  },

  calcDate(dias) {
    // Pega a data atual
    const dataAtual = new Date();

    // Adiciona ou subtrai os dias
    dataAtual.setDate(dataAtual.getDate() + dias);

    // Formata a data para YYYY-MM-DD
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, "0"); // Os meses são baseados em 0
    const dia = String(dataAtual.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  },
};
