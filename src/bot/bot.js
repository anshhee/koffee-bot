import { Telegraf } from 'telegraf';
import startCommand from './commands/start.js';
import createwalletCommand from './commands/createwallet.js';
import balanceCommand from './commands/balance.js';
import { registerAnalyzeCommand } from './commands/analyze.js';
import { registerHistoryCommand } from './commands/history.js';

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
    registerAnalyzeCommand(bot);
    registerHistoryCommand(bot);

    // Register inline button actions
    bot.action('action_createwallet', async (ctx) => {
        await ctx.answerCbQuery();
        await createwalletCommand(ctx);
    });

    bot.action('action_balance', async (ctx) => {
        await ctx.answerCbQuery();
        await balanceCommand(ctx);
    });

    bot.action('action_help', async (ctx) => {
        await ctx.answerCbQuery();
        const helpMessage = `
ℹ️ **KOFFEE Bot Commands**

Here are all the available options you can use:

/start - Open the main menu
/createwallet - Generate a new Solana Devnet wallet
/balance - Check your Devnet SOL balance
/analyze <token-address> - Analyze the risk of a specific token
/history - View your recent token analyses

*You can also use the inline menu buttons for quick access!*
        `;
        await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
    });

    // Basic message handler for testing/fallbacks
    bot.on('text', (ctx) => {
        if (!ctx.message.text.startsWith('/')) {
            ctx.reply('I am KOFFEE, your Solana Devnet assistant. Type /start to begin or /createwallet to generate a Devnet wallet.');
        }
    });

    return bot;
};
