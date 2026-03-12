const express = require("express");
const router = express.Router();

const {
  createResource,
  getResources,
  getMyResources,
  searchResources,
  deleteResource
} = require("../controllers/resourceController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


// GET all resources
router.get("/", getResources);


// SEARCH resources
router.get("/search", searchResources);


// GET resources uploaded by logged-in user
router.get("/my", authMiddleware, getMyResources);


// CREATE resource (with file upload)
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  createResource
);


// DELETE resource
router.delete(
  "/:id",
  authMiddleware,
  deleteResource
);


module.exports = router;