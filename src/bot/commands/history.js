import { getUserHistory } from '../../services/analysisService.js';

/**
 * Registers the /history command for the bot.
 * @param {Object} bot - The Telegraf bot instance.
 */
export const registerHistoryCommand = (bot) => {
    bot.command('history', async (ctx) => {
        try {
            const telegramId = ctx.from.id.toString();

            const loadingMsg = await ctx.reply('⏳ Fetching your analysis history...');

            const history = await getUserHistory(telegramId, 5);

            await ctx.deleteMessage(loadingMsg.message_id).catch(() => { });

            if (!history || history.length === 0) {
                return ctx.reply('📭 You have no recent token analyses.');
            }

            let responseMessage = '📜 Your Last 5 Token Analyses\n\n';

            history.forEach((record, index) => {
                const mintStatus = record.mintAuthorityActive ? 'Active ❌' : 'Revoked ✅';

                const addressDisplay =
                    record.tokenAddress.length > 12
                        ? `${record.tokenAddress.slice(0, 4)}...${record.tokenAddress.slice(-4)}`
                        : record.tokenAddress;

                responseMessage += `${index + 1}. Token: ${addressDisplay}\n`;
                responseMessage += `   Score: ${record.riskScore}/100\n`;
                responseMessage += `   Mint Authority: ${mintStatus}\n\n`;
            });

            await ctx.reply(responseMessage);

        } catch (error) {
            console.error('Error in /history command:', error);
            await ctx.reply('❌ An error occurred while fetching your history. Please try again later.');
        }
    });
};
