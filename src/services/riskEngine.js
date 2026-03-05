import { fetchMintInfo } from "./tokenAnalyzer.js";
import { fetchLiquidity } from "./liquidityAnalyzer.js";

/**
 * Collects all token metrics needed for analysis
 */
const collectTokenMetrics = async (tokenAddress) => {
    const mintData = await fetchMintInfo(tokenAddress);
    const liquidityData = await fetchLiquidity(tokenAddress);

    return {
        tokenAddress,
        mintAuthorityActive: mintData.mintAuthorityActive,
        supply: mintData.supply,
        decimals: mintData.decimals,
        liquidityUSD: liquidityData.liquidityUSD,
        liquidityLevel: liquidityData.liquidityLevel
    };
};

/**
 * Calculates risk score based on metrics
 */
const scoreTokenRisk = (metrics) => {
    let score = 100;

    if (metrics.mintAuthorityActive) score -= 30;
    if (metrics.liquidityLevel === "Low") score -= 25;
    if (metrics.supply > 500_000_000) score -= 10;

    score = Math.max(score, 0);

    return score;
};

/**
 * Main risk analysis function
 */
export const analyzeTokenRisk = async (tokenAddress) => {
    const metrics = await collectTokenMetrics(tokenAddress);

    const riskScore = scoreTokenRisk(metrics);

    return {
        ...metrics,
        riskScore
    };
};

