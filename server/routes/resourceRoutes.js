const express = require("express");
const router = express.Router();

const {
  createResource,
  getResources,
  getResourceById,
  getMyResources,
  searchResources,
  deleteResource
} = require("../controllers/resourceController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


// GET all resources
router.get("/", getResources);

// SEARCH resources
// NOTE: /search must come before /:id — otherwise Express matches
// the word "search" as an :id param and hits the wrong handler
router.get("/search", searchResources);

// GET resources uploaded by logged-in user
router.get("/my", authMiddleware, getMyResources);

// GET single resource by ID
router.get("/:id", getResourceById);

// CREATE resource
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  createResource
);

// DELETE resource (owner OR admin)
router.delete(
  "/:id",
  authMiddleware,
  deleteResource
);

module.exports = router;