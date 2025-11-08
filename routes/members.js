import express from "express";
import * as controller from "../controllers/controller.js";

const router = express.Router();

// Members routes
router.get("/", controller.getAllMembers);
router.get("/create", controller.getCreateMemberForm);
router.post("/create", controller.createMember);
router.get("/:id", controller.getMemberById);
router.get("/:id/edit", controller.getEditMemberForm);
router.post("/:id/edit", controller.updateMember);
router.post("/:id/delete", controller.deleteMember);

export default router;
