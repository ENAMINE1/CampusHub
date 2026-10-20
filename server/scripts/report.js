// Reads the events JSON file and writes a plain-text summary to reports/events-summary.txt.
// Teaches core modules: node:fs/promises for files and node:path for building file paths safely.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// import.meta.dirname is this file's folder, so the script works no matter where you run it from.
const serverDir = path.join(import.meta.dirname, '..');
const dataFile = path.join(serverDir, 'data', 'events.json');
const reportDir = path.join(serverDir, 'reports');
const reportFile = path.join(reportDir, 'events-summary.txt');

function countBy(items, getKey) {
  const counts = {};
  for (const item of items) {
    const key = getKey(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function buildReport(events) {
  const seatsTaken = events.reduce((sum, e) => sum + e.seatsTaken, 0);
  const capacity = events.reduce((sum, e) => sum + e.capacity, 0);
  const full = events.filter((e) => e.seatsTaken >= e.capacity).map((e) => e.title);
  const lines = [
    'CampusHub events report',
    `Generated: ${new Date().toISOString()}`,
    '',
    `Events: ${events.length}`,
    `Seats taken: ${seatsTaken} of ${capacity}`,
    `Full events: ${full.length ? full.join(', ') : 'none'}`,
    '',
    'By category:',
    ...Object.entries(countBy(events, (e) => e.category)).map(([k, n]) => `  ${k}: ${n}`),
    '',
    'By club:',
    ...Object.entries(countBy(events, (e) => e.club.name)).map(
      ([k, n]) => `  ${k}: ${n}`,
    ),
  ];
  return lines.join('\n') + '\n';
}

try {
  const events = JSON.parse(await readFile(dataFile, 'utf8'));
  // recursive: true means "create it if missing, do nothing if it already exists".
  await mkdir(reportDir, { recursive: true });
  await writeFile(reportFile, buildReport(events));
  console.log(`Report written to ${path.relative(process.cwd(), reportFile)}`);
} catch (error) {
  console.error(`Could not build the report: ${error.message}`);
  process.exitCode = 1;
}
