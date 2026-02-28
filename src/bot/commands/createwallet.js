import { generateWallet } from '../../blockchain/wallet.js';
import { User } from '../../models/User.js';
import { getMainMenu } from '../utils/menu.js';

/**
 * Handler for the /createwallet Telegram command.
 * Connects the blockchain logic and database logic seamlessly 
 * while keeping concerns modular and separate.
 */
export default async (ctx) => {
    try {
        const telegramId = ctx.from.id.toString();

        // 1. Check if the user already exists in MongoDB and has a wallet
        let user = await User.findOne({ telegramId });
        if (user && user.walletPublicKey) {
            return ctx.reply(`You already have a wallet created!\n\n*Public Key:*\n\`${user.walletPublicKey}\``, { parse_mode: 'Markdown', ...getMainMenu() });
        }

        // Acknowledge the request so the user knows it's processing
        const loadingMessage = await ctx.reply('⏳ Generating your secure Devnet wallet...');

        // 2. Delegate to the separate blockchain module to generate the wallet
        const { publicKey, privateKey } = await generateWallet();

        // 3. Store ONLY the public key in MongoDB (Database logic separate)
        if (!user) {
            user = new User({ telegramId, walletPublicKey: publicKey });
        } else {
            user.walletPublicKey = publicKey;
        }
        await user.save();

        // 4. Construct response showing BOTH keys as requested (Only safe on DEVNET)
        const responseMessage = `
✅ **Wallet Created Successfully!**

*Public Key:*
\`${publicKey}\`

*Private Key (Base58 format, Devnet Only):*
\`${privateKey}\`

⚠️ *Store your private key securely! KOFFEE only saves your public key in the database.*
`;

        // Try to remove "⏳ Generating..." message and send the final response
        await ctx.deleteMessage(loadingMessage.message_id).catch(() => { });
        await ctx.reply(responseMessage, { parse_mode: 'Markdown', ...getMainMenu() });

    } catch (error) {
        // Basic error handling structure catching async faults
        console.error('Error in /createwallet command:', error);
        await ctx.reply('❌ An error occurred while generating your wallet. Please try again later.', getMainMenu());
    }
};
