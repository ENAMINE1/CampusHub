// First Node.js script: proves Node runs outside the browser and shows a few things only Node can see.
import os from 'node:os';

console.log(`Hello from Node ${process.version} on ${os.platform()} (${os.arch()})`);
console.log(`This folder: ${process.cwd()}`);
console.log(`Arguments you passed: ${JSON.stringify(process.argv.slice(2))}`);
