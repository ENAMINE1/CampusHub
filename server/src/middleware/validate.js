// Checks req.body, req.query and req.params against Zod schemas before the controller runs.
// Parsed values land on req.validated: Express 5 makes req.query read-only, so we cannot replace it.
import ApiError from '../utils/ApiError.js';

export default function validate(schemas) {
  return (req, res, next) => {
    req.validated = {};
    const details = [];

    for (const part of ['params', 'query', 'body']) {
      if (!schemas[part]) continue;
      const result = schemas[part].safeParse(req[part] ?? {});
      if (result.success) {
        req.validated[part] = result.data;
      } else {
        for (const issue of result.error.issues) {
          details.push({
            location: part,
            path: issue.path.join('.'),
            message: issue.message,
          });
        }
      }
    }

    if (details.length > 0) {
      return next(
        new ApiError(422, 'VALIDATION_ERROR', 'Some fields are invalid.', details),
      );
    }
    next();
  };
}
