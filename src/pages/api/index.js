import axios from "axios";
import UtilsController from "../../controllers/UtilsController";

export default async (req, res) => {
  try {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=3600");

    var providerList = UtilsController.suportedProviders.map(async (mp) => {
      try {
        var { status } = await axios.get(mp.info.vendor.url);
        mp.info.vendor.status = status;
        return mp;
      } catch (error) {
        mp.info.vendor.status = error.status;
        return mp;
      }
    });

    var providerList = await Promise.all(providerList);

    res.status(200).json({
      status: true,
      message: "api is running",
      providerList,
      lastUpdate: {
        timestamp: Math.round(new Date().getTime() / 1000),
        date: new Date().toLocaleString("pt-BR"),
        iso: new Date().toLocaleString("pt-BR"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
