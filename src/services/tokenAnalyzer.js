import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Initialize connection to Solana Devnet
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

/**
 * Fetches and parses mint information for a given token address on Solana Devnet.
 * 
 * @param {string} tokenAddress - The mint address of the SPL token.
 * @returns {Promise<{supply: string, decimals: number, mintAuthorityActive: boolean}>}
 */
export const fetchMintInfo = async (tokenAddress) => {
    // 1. Validate public key format
    let pubKey;
    try {
        pubKey = new PublicKey(tokenAddress);
    } catch (error) {
        throw new Error(`Invalid token address format: ${tokenAddress}`);
    }

    try {
        // 2. Fetch parsed account info
        const accountInfo = await connection.getParsedAccountInfo(pubKey);

        // Throw if account does not exist
        if (!accountInfo.value) {
            throw new Error(`Token not found on Devnet: ${tokenAddress}`);
        }

        const accountData = accountInfo.value.data;

        // Ensure the account is a parsed SPL token mint
        if (typeof accountData !== 'object' || accountData.program !== 'spl-token' || accountData.parsed.type !== 'mint') {
            throw new Error(`Address is not a valid SPL token mint: ${tokenAddress}`);
        }

        const parsedMintInfo = accountData.parsed.info;

        // 3. Extract requested data
        const supply = parsedMintInfo.supply;
        const decimals = parsedMintInfo.decimals;

        // mintAuthority is null if disabled/renounced, otherwise a string address
        const mintAuthorityActive = parsedMintInfo.mintAuthority !== null;

        // 4. Return structured object
        return {
            supply,
            decimals,
            mintAuthorityActive
        };
    } catch (error) {
        // Preserve our explicit error messages, wrap unexpected ones
        if (error.message.includes('Invalid') || error.message.includes('not found') || error.message.includes('not a valid SPL token mint')) {
            throw error;
        }
        throw new Error(`Failed to fetch mint info: ${error.message}`);
    }
};
