import express from "express";
import * as controller from "../controllers/controller.js";

const router = express.Router();

// Books routes
router.get("/", controller.getAllBooks);
router.get("/create", controller.getCreateBookForm);
router.post("/create", controller.createBook);
router.get("/:id", controller.getBookById);
router.get("/:id/edit", controller.getEditBookForm);
router.post("/:id/edit", controller.updateBook);
router.post("/:id/delete", controller.deleteBook);

export default router;
