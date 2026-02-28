import { getMainMenu } from '../utils/menu.js';

/**
 * Handler for the /start command
 */
export default async (ctx) => {
    try {
        const user = ctx.from;

        const welcomeMessage = `
Welcome to ☕ KOFFEE, ${user.first_name}!

I am your risk-aware Solana Devnet assistant.
Here's what I can do for you:
  - Generate a secure Devnet wallet
  - Analyze tokens for risks
  - Simulate trades

Use the menu to explore my features.
`;

        await ctx.reply(welcomeMessage, getMainMenu());
    } catch (error) {
        console.error('Error in start command:', error);
        await ctx.reply('Sorry, something went wrong while processing your request.');
    }
};
