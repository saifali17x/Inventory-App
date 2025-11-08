import express from "express";
import * as controller from "../controllers/controller.js";

const router = express.Router();

// Categories routes
router.get("/", controller.getAllCategories);
router.get("/create", controller.getCreateCategoryForm);
router.post("/create", controller.createCategory);
router.get("/:id", controller.getCategoryById);
router.get("/:id/edit", controller.getEditCategoryForm);
router.post("/:id/edit", controller.updateCategory);
router.post("/:id/delete", controller.deleteCategory);

export default router;
