import {
  createFromGithub,
  createFromZip,
  getRepositoryById,
  getRepositoryStatus,
  getRepositoryFiles,
  getRepositoryFile,
} from "../services/repository.service.js";

import { askRipple } from "../../../analysis/ai/askRipple.js";
import { analyzeImpact } from "../../../analysis/ai/impactAnalysis.js";
import { analyzeWhatIf } from "../../../analysis/ai/whatIf.js";

export async function createRepository(req, res, next) {
  try {
    if (req.file) {
      const repository = await createFromZip(req.file);

      return res.status(201).json({
        success: true,
        data: {
          repositoryId: repository.id,
          status: repository.status,
        },
      });
    }

    if (req.body?.source === "github") {
      const repository = await createFromGithub(req.body.url);

      return res.status(201).json({
        success: true,
        data: {
          repositoryId: repository.id,
          status: repository.status,
        },
      });
    }

    const error = new Error("Provide a ZIP file or a GitHub repository URL");

    error.statusCode = 400;
    error.code = "INVALID_REQUEST";

    throw error;
  } catch (error) {
    next(error);
  }
}

export async function getRepository(req, res, next) {
  try {
    const repository = getRepositoryById(req.params.repositoryId);

    return res.json({
      success: true,
      data: {
        repositoryId: repository.id,
        name: repository.name,
        source: repository.source,
        status: repository.status,
        createdAt: repository.createdAt,
        totalFiles: repository.totalFiles ?? 0,

        // Repository analysis
        files: repository.files ?? [],
        analysis: repository.analysis ?? null,
        coverage: repository.coverage ?? null,
        warnings: repository.warnings ?? [],
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRepositoryStatusController(req, res, next) {
  try {
    const status = getRepositoryStatus(req.params.repositoryId);

    return res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRepositoryFilesController(req, res, next) {
  try {
    const data = getRepositoryFiles(req.params.repositoryId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRepositoryAnalysisController(req, res, next) {
  try {
    const repository = getRepositoryById(req.params.repositoryId);

    return res.json({
      success: true,
      data: {
        symbols: repository.analysis?.symbols || [],
        relationships: repository.analysis?.relationships || [],
        graph: repository.analysis?.graph || {
          nodes: [],
          edges: [],
        },
        statistics: repository.analysis?.statistics || {},
        analysis: repository.analysis?.analysis || {},
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRepositoryFileController(req, res, next) {
  try {
    const file = await getRepositoryFile(
      req.params.repositoryId,
      req.params.fileId,
    );

    return res.json({
      success: true,
      data: file,
    });
  } catch (error) {
    next(error);
  }
}

export async function askRippleController(req, res, next) {
  try {
    const repository = getRepositoryById(req.params.repositoryId);

    const result = await askRipple(repository.analysis, req.body?.question);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function analyzeImpactController(req, res, next) {
  try {
    const repository = getRepositoryById(req.params.repositoryId);

    const result = await analyzeImpact(repository.analysis, req.body?.target);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function analyzeWhatIfController(req, res, next) {
  try {
    const repository = getRepositoryById(req.params.repositoryId);

    const result = await analyzeWhatIf(repository.analysis, req.body?.scenario);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
