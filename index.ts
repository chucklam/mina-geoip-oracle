import express, { Express, Request, Response } from 'express';
import { isReady, PrivateKey, PublicKey, CircuitString, Signature } from 'snarkyjs';
import dotenv from 'dotenv';
import { exit } from 'process';
dotenv.config();

const { PORT, PRIVATE_KEY } = process.env;
if (!PRIVATE_KEY) {
  console.error('Private key not specified');
  exit(1);
}

const port = PORT || 3000;

const app: Express = express();

// The public/private key of our account
let privateKey: PrivateKey;
let publicKey: PublicKey;

const getCountryCode = async (ip: string): Promise<string> => {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const json = await response.json();

  // Could also get "region", "lat", "lon", "timezone", etc.
  const { countryCode } = json;

  return countryCode;
};

const getSignedCountryCode = async (ip: string) => {
  const countryCode = await getCountryCode(ip);

  const ipField = CircuitString.fromString(ip);
  const countryCodeField = CircuitString.fromString(countryCode);
  const signature = Signature.create(
    privateKey,
    ipField.toFields().concat(countryCodeField.toFields())
  );

  return ({
    data: { ip, countryCode },
    signature,
    publicKey,
  });
}

app.get('/ip/:ip', async (req: Request, res: Response) => {
  const { ip } = req.params;

  const result = await getSignedCountryCode(ip);
  res.json(result);
});

isReady.then(() => {
  privateKey = PrivateKey.fromBase58(PRIVATE_KEY);
  publicKey = privateKey.toPublicKey();

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});
