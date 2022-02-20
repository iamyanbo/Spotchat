const router = require("express").Router();
const { auth: controller } = require("../controllers/");

router.route("/").get(controller.sample);

module.exports = router;
