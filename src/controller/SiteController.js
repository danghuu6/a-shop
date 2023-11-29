
class SiteController {

    healthCheck(req, res) {
        res.send("Server running!!!");
    }
}

module.exports = new SiteController;
