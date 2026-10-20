// Starts the HTTP server. This is the file you run; app.js holds the actual routes.
import app from './app.js';

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`CampusHub API listening on http://localhost:${PORT}`);
});
