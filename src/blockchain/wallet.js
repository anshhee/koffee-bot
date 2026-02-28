import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';
import { getConnection } from './connection.js';


/**
 * Generates a new Solana wallet using @solana/web3.js Keypair.
 * Extracted into a separate function to keep blockchain logic decoupled from the bot.
 * 
 * @returns {Promise<{publicKey: string, privateKey: string}>} The generated public key and private key base58 string or array.
 */
export const generateWallet = () => {
    const keypair = Keypair.generate();

    return {
        publicKey: keypair.publicKey.toString(),
        privateKey: bs58.encode(keypair.secretKey)
    };
};

/**
 * Retrieves the SOL balance for a given public key string.
 * Converts lamports to SOL automatically.
 * 
 * @param {string} address - The base58 encoded public key string.
 * @returns {Promise<number>} The balance in SOL.
 */
export const getBalance = async (address) => {
    try {
        const connection = getConnection();
        const publicKey = new PublicKey(address);
        const balanceInLamports = await connection.getBalance(publicKey);
        return balanceInLamports / LAMPORTS_PER_SOL;
    } catch (error) {
        console.error(`Error fetching balance for ${address}:`, error);
        throw new Error('Failed to fetch balance from Devnet');
    }
};
