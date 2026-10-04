import {
  createFromGithub,
  createFromZip,
} from "../services/repository.service.js";

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
      const repository = createFromGithub(req.body.url);

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
