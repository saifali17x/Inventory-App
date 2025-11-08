import express from "express";
import * as controller from "../controllers/controller.js";

const router = express.Router();

// Home route
router.get("/", controller.getHome);

export default router;
