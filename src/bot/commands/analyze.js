import { analyzeTokenRisk } from '../../services/riskEngine.js';
import { saveAnalysis } from '../../services/analysisService.js';

/**
 * Registers the /analyze command for the bot.
 * @param {Object} bot - The Telegraf bot instance.
 */
export const registerAnalyzeCommand = (bot) => {
    bot.command('analyze', async (ctx) => {
        try {
            // Parse token address from user input
            const messageText = ctx.message.text || '';
            const args = messageText.split(' ').slice(1);

            // Validate that a token address was provided
            if (args.length === 0 || !args[0]) {
                return ctx.reply('⚠️ Please provide a token address to analyze.\n\nUsage: `/analyze <token_address>`', { parse_mode: 'Markdown' });
            }

            const tokenAddress = args[0];

            // Inform the user that analysis is in progress
            const loadingMsg = await ctx.reply(`🔍 Analyzing token: \`${tokenAddress}\`...`, { parse_mode: 'Markdown' });

            // Call analyzeTokenRisk (now an async function pulling live devnet data)
            let riskReport;
            try {
                riskReport = await analyzeTokenRisk(tokenAddress);
            } catch (error) {
                await ctx.deleteMessage(loadingMsg.message_id).catch(() => { });
                return ctx.reply('❌ Invalid or unsupported token mint address.');
            }

            // Format a clean multi-line risk report message
            let reportMessage = `📊 **Token Risk Analysis Report**\n\n`;
            reportMessage += `*Token Address:* \`${riskReport.tokenAddress}\`\n`;
            reportMessage += `*Mint Authority Active:* ${riskReport.mintAuthorityActive ? '⚠️ Yes (-30 pts)' : '✅ No'}\n`;
            reportMessage += `*Liquidity:* ${riskReport.liquidityLevel === 'Low' ? '🔴 Low (-25 pts)' : riskReport.liquidityLevel === 'Moderate' ? '🟡 Moderate' : '🟢 High'} ($${riskReport.liquidityUSD.toLocaleString()})\n`;

            let ageStr = riskReport.tokenAgeLevel;
            if (riskReport.tokenAgeHours !== null) {
                ageStr += ` (${riskReport.tokenAgeHours.toFixed(1)}h)`;
            }
            let agePenalty = riskReport.tokenAgeLevel === 'Very New' ? ' (-15 pts)' : riskReport.tokenAgeLevel === 'New' ? ' (-5 pts)' : '';
            reportMessage += `*Age:* ${ageStr}${agePenalty}\n`;

            let topHolderPenalty = riskReport.topHolderPercent > 50 ? ' (-20 pts)' : riskReport.topHolderPercent > 20 ? ' (-10 pts)' : '';
            let top5Penalty = riskReport.top5Percent > 80 ? ' (-15 pts)' : riskReport.top5Percent > 50 ? ' (-5 pts)' : '';
            reportMessage += `*Top Holder:* ${riskReport.topHolderPercent}%${topHolderPenalty}\n`;
            reportMessage += `*Top 5 Holders:* ${riskReport.top5Percent}%${top5Penalty}\n`;

            reportMessage += `*Supply:* ${riskReport.supply.toLocaleString()} ${riskReport.supply > 500000000 ? '(-10 pts)' : ''}\n\n`;

            // Determine risk level emoji based on score
            let scoreEmoji = '🟢';
            if (riskReport.riskScore < 50) scoreEmoji = '🔴';
            else if (riskReport.riskScore < 80) scoreEmoji = '🟡';

            reportMessage += `*Risk Score:* **${riskReport.riskScore}/100** ${scoreEmoji}`;

            // Save analysis to DB
            try {
                await saveAnalysis({
                    telegramId: ctx.from.id.toString(),
                    tokenAddress: riskReport.tokenAddress,
                    riskScore: riskReport.riskScore,
                    mintAuthorityActive: riskReport.mintAuthorityActive,
                    liquidity: riskReport.liquidityLevel,
                    supply: riskReport.supply,
                });
            } catch (dbError) {
                console.error('Failed to save analysis history:', dbError);
                // We proceed to send the report even if DB saving fails
            }

            // Remove loading message and send the final report
            await ctx.deleteMessage(loadingMsg.message_id).catch(() => { });
            await ctx.reply(reportMessage, { parse_mode: 'Markdown' });

        } catch (error) {
            console.error('Error in /analyze command:', error);
            await ctx.reply('❌ An error occurred while analyzing the token risk. Please try again later.');
        }
    });
};
