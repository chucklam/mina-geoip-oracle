import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 3000;

const app: Express = express();

const getCountryCode = async (ip: string): Promise<string> => {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const json = await response.json();
  console.log(json);

  // Could also get "region", "lat", "lon", "timezone", etc.
  const { countryCode } = json;

  return countryCode;
}

app.get('/ip/:ip', async (req: Request, res: Response) => {
  const { ip } = req.params;
  console.log(`You requested geolocation for IP: ${ip}`);

  const countryCode = await getCountryCode(ip);

  res.json({ countryCode });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
