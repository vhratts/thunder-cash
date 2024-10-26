import UtilsController from "../../../../../controllers/UtilsController";

export default async (req, res) => {
  try {
    var provider = UtilsController.HelperProvider(req);
    // Definindo o cabeçalho Cache-Control com stale-while-revalidate
    // res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=60");

    if (!req.query.type) {
      req.query.type = "input";
    }

    if (!req.query.options) {
      req.query.options = {
        page: 1,
        registrationDateStart: new Date(UtilsController.calcDate(-7)).toISOString(),
        registrationDateEnd: new Date().toISOString(),
      };
    }

    // console.log(req.query);

    res.status(200).json(await provider.getTransactions(req.query));
  } catch (error) {
    res.status(error.status).json({
      status: false,
      message: error.message,
      verbouse: error.response.data,
    });
  }
};
