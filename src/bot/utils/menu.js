// src/bot/utils/menu.js
import { Markup } from 'telegraf';

/**
 * Reusable inline keyboard menu for KOFFEE
 */
export const getMainMenu = () => {
    return Markup.inlineKeyboard([
        [Markup.button.callback('✨ Create Wallet', 'action_createwallet')],
        [Markup.button.callback('💰 Check Balance', 'action_balance')]
    ]);
};
