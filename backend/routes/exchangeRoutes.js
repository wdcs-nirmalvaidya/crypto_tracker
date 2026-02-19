const express = require("express");
const router = express.Router();
const exchangeController = require("../controllers/exchangeController");

router.get("/", exchangeController.getExchanges);
router.get("/:id", exchangeController.getExchangeById); // 👈 THIS WAS MISSING
router.post("/", exchangeController.createExchange);
router.put("/:id", exchangeController.updateExchange);
router.delete("/:id", exchangeController.deleteExchange);

module.exports = router;
