import 'dotenv/config';
import { Express } from 'express';
import app from './app';
import { db } from '@database';
import { registerOfferEvents } from '@integrations/telegram';

const PORT = process.env.PORT || 3000;

(async (app: Express) => {
  try {
    await db.$client.connect();

    registerOfferEvents();

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    const gracefulShutdown = async () => {
      console.log('Shutting down...');
      await db.$client.end();
      process.exit(0);
    };

    if (process.env.NODE_ENV === 'production') {
      process.on('SIGINT', gracefulShutdown);
      process.on('SIGTERM', gracefulShutdown);
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})(app);
