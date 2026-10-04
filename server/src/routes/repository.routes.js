import express from "express";
import {
  createRepository,
  getRepository,
  getRepositoryStatusController,
  getRepositoryFilesController,
  getRepositoryAnalysisController,
  getRepositoryFileController,
  getRepositoryGraphController,
  askRippleController,
  analyzeImpactController,
  analyzeWhatIfController,
} from "../controllers/repository.controller.js";
import { repositoryUpload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", repositoryUpload.single("file"), createRepository);
router.get("/:repositoryId/status", getRepositoryStatusController);
router.get("/:repositoryId/files/:fileId", getRepositoryFileController);
router.get("/:repositoryId/files", getRepositoryFilesController);
router.get("/:repositoryId/analysis", getRepositoryAnalysisController);
router.get("/:repositoryId/graph", getRepositoryGraphController);
router.post("/:repositoryId/ask", askRippleController);
router.post("/:repositoryId/impact", analyzeImpactController);
router.post("/:repositoryId/what-if", analyzeWhatIfController);
router.get("/:repositoryId", getRepository);

export default router;
