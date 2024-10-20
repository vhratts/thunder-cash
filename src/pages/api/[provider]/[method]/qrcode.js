import UtilsController from "../../../../controllers/UtilsController";

export default async (req, res) => {
  try {
    if (req.method === "POST") {
      // console.log(req.body, req.query, req.headers);
      var authKeys = UtilsController.filterAdaptor(req.headers);
      // console.log(authKeys);
      var gateway = UtilsController.suportedProviders
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

      var provider = new gateway.provider(authKeys);
      // Definindo o cabeçalho Cache-Control com stale-while-revalidate
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=60");
      res.status(200).json(await provider.generatingPixBilling(req.body));
    } else {
      // Se não for POST, retorna erro 405 (Method Not Allowed)
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
