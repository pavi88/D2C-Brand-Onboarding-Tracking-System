const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/brandController");

router.post("/brands", ctrl.createBrand);
router.get("/brands", ctrl.getBrands);
router.get("/brands/:id", ctrl.getSingleBrand);
router.patch("/brands/:id/status", ctrl.updateStatus);
router.post("/brands/:id/notes", ctrl.addNote);
router.get("/brands/summary", ctrl.getSummary);

module.exports = router;