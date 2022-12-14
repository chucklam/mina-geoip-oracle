import express, { Express, Request, Response } from 'express';
import { isReady, PrivateKey } from 'snarkyjs';
import dotenv from 'dotenv';
import { exit } from 'process';

import { getSignedCountryCode } from './countrycode';

dotenv.config();

const { PORT, PRIVATE_KEY } = process.env;
if (!PRIVATE_KEY) {
  console.error('Private key not specified');
  exit(1);
}

const port = PORT || 3000;

const app: Express = express();

// The private key of our signer
let privateKey: PrivateKey;

app.get('/ip/:ip', async (req: Request, res: Response) => {
  const { ip } = req.params;

  const result = await getSignedCountryCode(ip, privateKey);
  res.json(result);
});

isReady.then(() => {
  privateKey = PrivateKey.fromBase58(PRIVATE_KEY);

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});
