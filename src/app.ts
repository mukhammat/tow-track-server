import express from 'express';
import cors from 'cors';

import { db } from '@database';
import { errorHanler } from '@middleware';
import { routers } from './routers';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routers(db));

app.get('/check', (_req, res) => {
  res.status(200).json({ message: 'Check...' });
});

app.use(errorHanler);
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default app;
