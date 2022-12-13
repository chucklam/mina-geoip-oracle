import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 3000;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/ip/:ip', (req: Request, res: Response) => {
  res.send(`You requested geolocation for IP: ${req.params.ip}`);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
