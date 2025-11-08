import express from "express";
import * as controller from "../controllers/controller.js";

const router = express.Router();

// Authors routes
router.get("/", controller.getAllAuthors);
router.get("/create", controller.getCreateAuthorForm);
router.post("/create", controller.createAuthor);
router.get("/:id", controller.getAuthorById);
router.get("/:id/edit", controller.getEditAuthorForm);
router.post("/:id/edit", controller.updateAuthor);
router.post("/:id/delete", controller.deleteAuthor);

export default router;
