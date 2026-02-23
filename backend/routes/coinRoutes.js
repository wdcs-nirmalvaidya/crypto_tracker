const express = require("express");
const router = express.Router();
const controller = require("../controllers/coinController");

router.get("/", controller.getCoins);
router.get("/:id", controller.getCoinById);          
router.get("/:id/history", controller.getCoinHistory); 

router.post("/", controller.createCoin);
router.put("/:id", controller.updateCoin);
router.delete("/:id", controller.deleteCoin);

module.exports = router;