import { getBalance } from '../../blockchain/wallet.js';
import { User } from '../../models/User.js';
import { getMainMenu } from '../utils/menu.js';

/**
 * Handler for the /balance Telegram command.
 * Fetches the user's stored public key and retrieves their devnet SOL balance.
 */
export default async (ctx) => {
    try {
        const telegramId = ctx.from.id.toString();

        // 1. Fetch user from DB (Service layer)
        const user = await User.findOne({ telegramId });

        if (!user || !user.walletPublicKey) {
            return ctx.reply('You do not have a wallet yet. Please create one using /createwallet first.', getMainMenu());
        }

        // Acknowledge the request
        const loadingMessage = await ctx.reply('⏳ Fetching your Devnet balance...');

        // 2. Connect to Solana and retrieve balance (Blockchain logic)
        const balance = await getBalance(user.walletPublicKey);

        // 3. Formulate the response
        const responseMessage = `
💰 **Wallet Balance**

*Address:* \`${user.walletPublicKey}\`
*Balance:* \`${balance} SOL\` (Devnet)
`;

        // Try to remove "⏳ Fetching..." message and send the final response
        await ctx.deleteMessage(loadingMessage.message_id).catch(() => { });
        await ctx.reply(responseMessage, { parse_mode: 'Markdown', ...getMainMenu() });

    } catch (error) {
        console.error('Error in /balance command:', error);
        await ctx.reply('❌ An error occurred while fetching your balance. Please try again later.', getMainMenu());
    }
};
