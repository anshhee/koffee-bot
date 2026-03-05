import Analysis from '../models/Analysis.js';

/**
 * Saves a new token analysis to the database.
 * @param {Object} data - The analysis data.
 * @returns {Promise<Object>} The saved analysis record.
 */
export const saveAnalysis = async (data) => {
    try {
        const analysis = new Analysis(data);
        return await analysis.save();
    } catch (error) {
        console.error('Error saving analysis:', error);
        throw error;
    }
};

/**
 * Fetches the recent analysis history for a given user.
 * @param {string} telegramId - The user's Telegram ID.
 * @param {number} limit - The maximum number of records to return.
 * @returns {Promise<Array>} List of recent analyses.
 */
export const getUserHistory = async (telegramId, limit = 5) => {
    try {
        return await Analysis.find({ telegramId })
            .sort({ createdAt: -1 })
            .limit(limit);
    } catch (error) {
        console.error('Error fetching user history:', error);
        throw error;
    }
};
