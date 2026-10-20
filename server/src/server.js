// Starts the HTTP server. This is the file you run; app.js holds the actual routes.
import config from './config/index.js';
import app from './app.js';

app.listen(config.port, () => {
  console.log(`CampusHub API listening on http://localhost:${config.port}`);
});
