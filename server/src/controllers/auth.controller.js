// HTTP layer for /api/v1/auth: sign up and log in.
import * as userService from '../services/user.service.js';
import { createAccessToken } from '../services/token.service.js';

function sendSession(res, status, user) {
  // The access token goes in the JSON body; the client keeps it in memory only.
  res
    .status(status)
    .json({ user: userService.toPublicUser(user), accessToken: createAccessToken(user) });
}

export async function register(req, res) {
  const user = await userService.createUser(req.validated.body);
  sendSession(res, 201, user);
}

export async function login(req, res) {
  const { email, password } = req.validated.body;
  const user = await userService.verifyCredentials(email, password);
  sendSession(res, 200, user);
}
