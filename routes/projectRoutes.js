const express = require("express");
const router = express.Router();
const multer = require('multer')
const upload = multer()
const PRO = require("../controllers/project")


router.get("/", PRO.fetchAllProject);
router.get("/:id", PRO.fetchProjectById);
router.post("/", upload.none(), PRO.createProject);
router.patch("/:id", upload.none(), PRO.updateProject);
router.delete("/:id", PRO.deleteProject);


module.exports = router;