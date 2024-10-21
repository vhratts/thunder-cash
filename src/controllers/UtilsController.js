import ThunderPix, {
  MercadoPagoProvider,
  PicPayProvider,
  PixProvider,
  PrimepagProvider,
} from "thunderpix";

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
};
