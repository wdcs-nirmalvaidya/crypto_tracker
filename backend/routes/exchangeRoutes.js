const express = require("express");
const router = express.Router();
const controller = require("../controllers/exchangeController");

router.get("/", controller.getExchanges);
router.post("/", controller.createExchange);
router.put("/:id", controller.updateExchange);
router.delete("/:id", controller.deleteExchange);

module.exports = router;
