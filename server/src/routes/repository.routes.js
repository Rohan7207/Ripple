import express from "express";
import {
  createRepository,
  getRepository,
  getRepositoryStatusController,
  getRepositoryFilesController,
  getRepositoryAnalysisController,
  getRepositoryFileController,
  getRepositoryGraphController,
} from "../controllers/repository.controller.js";
import { repositoryUpload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", repositoryUpload.single("file"), createRepository);
router.get("/:repositoryId/status", getRepositoryStatusController);
router.get("/:repositoryId/files/:fileId", getRepositoryFileController);
router.get("/:repositoryId/files", getRepositoryFilesController);
router.get("/:repositoryId/analysis", getRepositoryAnalysisController);
router.get("/:repositoryId/graph", getRepositoryGraphController);
router.get("/:repositoryId", getRepository);

export default router;
