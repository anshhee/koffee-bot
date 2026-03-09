import { fetchMintInfo } from "./tokenAnalyzer.js";
import { fetchLiquidity } from "./liquidityAnalyzer.js";
import { fetchTokenAge } from "./tokenAgeAnalyzer.js";
import { fetchHolderDistribution } from "./holderAnalyzer.js";

/**
 * Collects all token metrics needed for analysis
 */
const collectTokenMetrics = async (tokenAddress) => {
    const mintData = await fetchMintInfo(tokenAddress);
    const liquidityData = await fetchLiquidity(tokenAddress);

    let ageData = { tokenAgeHours: null, tokenAgeLevel: 'Unknown' };
    try {
        ageData = await fetchTokenAge(tokenAddress);
    } catch (err) {
        console.error("Could not fetch token age:", err.message);
    }

    let holderData = { topHolderPercent: 0, top5Percent: 0 };
    try {
        holderData = await fetchHolderDistribution(tokenAddress);
    } catch (err) {
        console.error("Could not fetch holder distribution:", err.message);
    }

    return {
        tokenAddress,
        mintAuthorityActive: mintData.mintAuthorityActive,
        supply: mintData.supply,
        decimals: mintData.decimals,
        liquidityUSD: liquidityData.liquidityUSD,
        liquidityLevel: liquidityData.liquidityLevel,
        tokenAgeHours: ageData.tokenAgeHours,
        tokenAgeLevel: ageData.tokenAgeLevel,
        topHolderPercent: holderData.topHolderPercent,
        top5Percent: holderData.top5Percent
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

    // Penalize newer tokens since they have higher risk of rug pull
    if (metrics.tokenAgeLevel === 'Very New') score -= 15;
    if (metrics.tokenAgeLevel === 'New') score -= 5;

    // Penalize highly centralized tokens (high percentage held by top accounts)
    if (metrics.topHolderPercent > 50) score -= 20;
    else if (metrics.topHolderPercent > 20) score -= 10;

    if (metrics.top5Percent > 80) score -= 15;
    else if (metrics.top5Percent > 50) score -= 5;

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

