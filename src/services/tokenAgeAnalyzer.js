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
 * Calculates the age level based on token age in hours.
 * Rules:
 * - Very New: < 24 hours
 * - New: 1–7 days
 * - Established: > 7 days
 * 
 * @param {number} hours Token age in hours
 * @returns {string} Token age level category
 */
const determineAgeLevel = (hours) => {
    if (hours < 24) {
        return 'Very New';
    } else if (hours <= 24 * 7) {
        return 'New';
    } else {
        return 'Established';
    }
};

/**
 * Detects the age of a Solana token mint.
 * 
 * @param {string} tokenAddress The address of the token mint
 * @returns {Promise<{tokenAgeHours: number, tokenAgeLevel: string}>}
 */
const fetchTokenAge = async (tokenAddress) => {
    try {
        // 1. Convert tokenAddress to PublicKey
        const mintPublicKey = getPublicKey(tokenAddress);

        // 2. Connect to Solana Devnet
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        // 3. Fetch signatures for the mint address
        let oldestSignatureInfo = null;
        let before = undefined;

        // Loop to fetch all signatures and find the oldest one
        while (true) {
            const signatures = await connection.getSignaturesForAddress(mintPublicKey, {
                before,
                limit: 1000
            });

            if (signatures.length === 0) {
                break;
            }

            oldestSignatureInfo = signatures[signatures.length - 1];
            before = oldestSignatureInfo.signature;

            // Stop fetching if we received less than the limit, meaning we've reached the end
            if (signatures.length < 1000) {
                break;
            }
        }

        if (!oldestSignatureInfo) {
            throw new Error('No transactions found for this token address');
        }

        // 4. Fetch the block time
        let blockTime = oldestSignatureInfo.blockTime;

        // In rare cases or depending on the RPC node, blockTime might not be present in the signature info
        if (!blockTime) {
            blockTime = await connection.getBlockTime(oldestSignatureInfo.slot);
            if (!blockTime) {
                throw new Error('Could not determine block time for the oldest signature');
            }
        }

        // 5. Calculate token age in hours
        const currentTimeSeconds = Math.floor(Date.now() / 1000);
        const ageSeconds = currentTimeSeconds - blockTime;
        const tokenAgeHours = ageSeconds / 3600; // 3600 seconds in an hour

        const tokenAgeLevel = determineAgeLevel(tokenAgeHours);

        return {
            tokenAgeHours,
            tokenAgeLevel
        };

    } catch (error) {
        throw new Error(`Failed to fetch token age: ${error.message}`);
    }
};

export {
    fetchTokenAge
};
