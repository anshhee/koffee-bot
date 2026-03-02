import { fetchMintInfo } from './tokenAnalyzer.js';

/**
 * Analyzes the risk of a given token address based on live devnet data.
 * @param {string} tokenAddress - The address of the token to analyze.
 * @returns {Promise<Object>} Structured object containing token data and risk score.
 */
export const analyzeTokenRisk = async (tokenAddress) => {
    // Fetch live token data from Solana Devnet
    const { supply, decimals, mintAuthorityActive } = await fetchMintInfo(tokenAddress);

    // Keep liquidity mocked for now
    const liquidityOptions = ["Low", "Moderate", "High"];
    const liquidity = liquidityOptions[Math.floor(Math.random() * liquidityOptions.length)];

    // Implement a scoring system
    let riskScore = 100;

    if (mintAuthorityActive) {
        riskScore -= 30;
    }

    if (liquidity === "Low") {
        riskScore -= 25;
    }

    if (supply > 500_000_000) {
        riskScore -= 10;
    }

    // Return a structured object
    return {
        tokenAddress,
        mintAuthorityActive,
        liquidity,
        supply,
        decimals,
        riskScore
    };
};
