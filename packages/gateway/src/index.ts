import { makeApp } from './server';
import { Command } from 'commander';
import { ethers } from 'ethers';
import { JSONDatabase } from './json';
require('dotenv').config()

const program = new Command();
program
  .requiredOption('-d --data <file>', 'JSON file to read data from')
  .option('-t --ttl <number>', 'TTL for signatures', '300')
  .option('-p --port <number>', 'Port number to serve on', '8080');
program.parse(process.argv);
const options = program.opts();
let privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("Missing expected private key env var");
}
const address = ethers.utils.computeAddress(privateKey);
const signer = new ethers.utils.SigningKey(privateKey);
const db = JSONDatabase.fromFilename(options.data, parseInt(options.ttl));
const app = makeApp(signer, '/', db);
console.log(`Serving on port ${options.port} with signing address ${address}`);
app.listen(parseInt(options.port));

module.exports = app;
