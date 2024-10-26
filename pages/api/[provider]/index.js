import UtilsController from "../../../controllers/UtilsController"

export default (req, res) => {
    try {
        var response;
        for(var item of UtilsController.suportedProviders){
            if(req.query.provider == item.name){
                response = item;
            }
        }
        
        res.json(response);
    } catch (error) {
        res.status(404).json({
            status: false,
            message: error.message
        });
    }
}