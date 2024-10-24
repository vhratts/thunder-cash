import UtilsController from "../../../../../controllers/UtilsController";

export default async (req, res) => {
  try {
    var provider = UtilsController.HelperProvider(req);
    // Definindo o cabeçalho Cache-Control com stale-while-revalidate
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=60");
    res.status(200).json(await provider.getQrCode(req.query));
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      verbouse: error.response.data

    });
  }
};
