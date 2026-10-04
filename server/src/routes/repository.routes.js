import express from "express";
import { createRepository } from "../controllers/repository.controller.js";
import { repositoryUpload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", repositoryUpload.single("file"), createRepository);

export default router;
