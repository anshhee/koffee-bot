import axios from 'axios';

/**
 * Fetches token liquidity from the DexScreener API.
 * @param {string} tokenAddress - The address of the token to check.
 * @returns {Promise<{liquidityUSD: number, liquidityLevel: string}>} The USD liquidity and its classification level.
 */
export const fetchLiquidity = async (tokenAddress) => {
    try {
        const response = await axios.get(
            `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
            { timeout: 5000 }
        );

        if (!response.data || !response.data.pairs || response.data.pairs.length === 0) {
            return {
                liquidityUSD: 0,
                liquidityLevel: 'Low'
            };
        }

        // Find pair with highest liquidity
        const bestPair = response.data.pairs.reduce((max, pair) => {
            const currentLiquidity = pair.liquidity?.usd || 0;
            const maxLiquidity = max.liquidity?.usd || 0;
            return currentLiquidity > maxLiquidity ? pair : max;
        });

        const liquidityUSD = parseFloat(bestPair.liquidity?.usd || 0);

        let liquidityLevel = 'Low';

        if (liquidityUSD >= 10000 && liquidityUSD <= 100000) {
            liquidityLevel = 'Moderate';
        } else if (liquidityUSD > 100000) {
            liquidityLevel = 'High';
        }

        return {
            liquidityUSD,
            liquidityLevel
        };

    } catch (error) {
        console.error(`DexScreener liquidity fetch failed:`, error.message);

        return {
            liquidityUSD: 0,
            liquidityLevel: 'Low'
        };
    }
};
