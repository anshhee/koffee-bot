import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

/**
 * Validates and converts a string address to a PublicKey object.
 * @param {string} address The token address string
 * @returns {PublicKey} The PublicKey object
 */
const getPublicKey = (address) => {
    try {
        return new PublicKey(address);
    } catch (error) {
        throw new Error('Invalid token address');
    }
};

/**
 * Analyzes holder distribution for a Solana token.
 * 
 * @param {string} tokenAddress The address of the token mint
 * @returns {Promise<{topHolderPercent: number, top5Percent: number}>}
 */
export const fetchHolderDistribution = async (tokenAddress) => {
    try {
        // 1. Convert tokenAddress to PublicKey
        const mintPublicKey = getPublicKey(tokenAddress);

        // 2. Connect to Solana Devnet
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        // 3. Fetch token accounts for the mint (using getTokenLargestAccounts)
        // Note: getTokenLargestAccounts is the most efficient way to get top holders
        const largestAccounts = await connection.getTokenLargestAccounts(mintPublicKey);

        if (!largestAccounts.value || largestAccounts.value.length === 0) {
            throw new Error('No holders found for this token');
        }

        // 4. Extract balances and calculate total supply mapped from the largest accounts
        // We calculate percentage based on the circulating supply among the largest accounts 
        // as fetching ALL accounts for a token can be extremely slow/impossible on public RPCs.
        // If exact total supply is needed across all accounts, connection.getTokenSupply would be better.
        // We will fetch the actual total supply to calculate accurate percentages.

        const supplyInfo = await connection.getTokenSupply(mintPublicKey);

        const totalSupply = Number(supplyInfo.value.uiAmountString);

        if (!totalSupply || totalSupply === 0) {
            return {
                topHolderPercent: 0,
                top5Percent: 0
            };
        }

        const balances = largestAccounts.value
            .map(account => Number(account.uiAmountString))
            .filter(v => !isNaN(v));

        const topHolderBalance = balances[0] || 0;

        const topHolderPercent = (topHolderBalance / totalSupply) * 100;

        const top5Sum = balances.slice(0, 5).reduce((a, b) => a + b, 0);

        const top5Percent = (top5Sum / totalSupply) * 100;

        return {
            topHolderPercent: Number(topHolderPercent.toFixed(2)),
            top5Percent: Number(top5Percent.toFixed(2))
        };

    } catch (error) {
        throw new Error(`Failed to fetch holder distribution: ${error.message}`);
    }
};
