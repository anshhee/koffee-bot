import { Telegraf } from 'telegraf';
import startCommand from './commands/start.js';
import createwalletCommand from './commands/createwallet.js';
import balanceCommand from './commands/balance.js';

export const setupBot = (token) => {
    if (!token) {
        throw new Error('Telegram bot token is not provided');
    }

    const bot = new Telegraf(token);

    // Basic error handling middleware
    bot.catch((err, ctx) => {
        console.error(`Error for ${ctx.updateType}:`, err);
        ctx.reply('An unexpected error occurred. Please try again later.').catch(console.error);
    });

    // Register commands
    bot.start(startCommand);
    bot.command('createwallet', createwalletCommand);
    bot.command('balance', balanceCommand);

    // Register inline button actions
    bot.action('action_createwallet', async (ctx) => {
        await ctx.answerCbQuery();
        await createwalletCommand(ctx);
    });

    bot.action('action_balance', async (ctx) => {
        await ctx.answerCbQuery();
        await balanceCommand(ctx);
    });

    // Basic message handler for testing/fallbacks
    bot.on('text', (ctx) => {
        if (!ctx.message.text.startsWith('/')) {
            ctx.reply('I am KOFFEE, your Solana Devnet assistant. Type /start to begin or /createwallet to generate a Devnet wallet.');
        }
    });

    return bot;
};
