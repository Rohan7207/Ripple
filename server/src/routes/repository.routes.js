import express from "express";
import {
  createRepository,
  getRepository,
  getRepositoryStatusController,
  getRepositoryFilesController,
  getRepositoryAnalysisController,
} from "../controllers/repository.controller.js";
import { repositoryUpload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  (req, res, next) => {
    console.log("POST /api/repositories reached");
    next();
  },
  repositoryUpload.single("file"),
  createRepository,
);
// router.post("/", repositoryUpload.single("file"), createRepository);
router.get("/:repositoryId/status", getRepositoryStatusController);
router.get("/:repositoryId/files", getRepositoryFilesController);
router.get("/:repositoryId/analysis", getRepositoryAnalysisController);
router.get("/:repositoryId", getRepository);

export default router;
