import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import { setupBot } from './bot/bot.js';

const bootstrap = async () => {
    try {
        console.log('☕ Initializing KOFFEE project...');

        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        if (!botToken) {
            throw new Error("TELEGRAM_BOT_TOKEN is missing in environment variables.");
        }

        // 1. Connect to Database
        await connectDB();

        // 2. Setup Bot
        const bot = setupBot(botToken);

        // 3. Launch Bot
        await bot.launch();
        console.log('🤖 KOFFEE Telegram bot is up and running!');

        // 4. Graceful shutdown
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));

        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Promise Rejection:', err);
        });

    } catch (error) {
        console.error('Initialization error:', error);
        process.exit(1);
    }
};

bootstrap();
