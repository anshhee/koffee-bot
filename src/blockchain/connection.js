import { Connection, clusterApiUrl } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initializes and returns a connection to the Solana network.
 * By default, connects to the Devnet environment as required for KOFFEE.
 */
export const getConnection = () => {
    // Use custom RPC url from env variables or fallback to the official devnet endpoint
    const rpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');
    return new Connection(rpcUrl, 'confirmed');
};
