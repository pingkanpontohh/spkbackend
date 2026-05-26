const express = require("express");

const router = express.Router();

const {

  getJurusan

} = require(
  "../controllers/jurusanController"
);

router.get(
  "/",
  getJurusan
);

module.exports = router;