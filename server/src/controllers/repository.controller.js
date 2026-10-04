import {
  createFromGithub,
  createFromZip,
  getRepositoryById,
  getRepositoryStatus,
  getRepositoryFiles,
  getRepositoryFile,
  getRepositoryGraph,
} from "../services/repository.service.js";

export async function createRepository(req, res, next) {
  console.log("BODY:", req.body);
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
        source: repository.source,
        status: repository.status,
        createdAt: repository.createdAt,
        totalFiles: repository.totalFiles ?? 0,
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

export function getRepositoryGraphController(req, res, next) {
  try {
    const graph = getRepositoryGraph(req.params.repositoryId);

    return res.json({
      success: true,
      data: graph,
    });
  } catch (error) {
    next(error);
  }
}
