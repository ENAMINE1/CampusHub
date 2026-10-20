// HTTP layer for /api/v1/admin.
import * as adminService from '../services/admin.service.js';

export async function stats(req, res) {
  res.json(await adminService.getStats());
}
