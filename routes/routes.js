const express = require("express");
const router = express.Router();
const multer = require('multer')
const upload = multer()
const API = require("../controllers/api")




router.get("/", API.fetchAllTask);

router.get("/:id", API.fetchById);
router.post("/", upload.none(), API.createTask);
router.patch("/:id", upload.none(), API.updateTask);
router.delete("/:id", API.deleteTask);


module.exports = router;