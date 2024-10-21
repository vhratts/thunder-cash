import UtilsController from "../../../../controllers/UtilsController";

export default async (req, res) => {
  try {
    if (req.method === "POST") {
      var provider = UtilsController.HelperProvider(req);
      // Definindo o cabeçalho Cache-Control com stale-while-revalidate
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=60");
      res.status(200).json(await provider.getTransactions(req.body));
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
