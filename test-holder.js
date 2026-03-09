import { fetchHolderDistribution } from './src/services/holderAnalyzer.js';
import { Keypair } from '@solana/web3.js';

async function runTest() {
    try {
        // Test 1: Invalid address
        console.log("--- Test 1: Invalid Address ---");
        try {
            await fetchHolderDistribution("invalid_address_format");
        } catch (e) {
            console.log("Expected Error:", e.message);
        }

        // Test 2: Valid address but no holders (random new keypair)
        console.log("\n--- Test 2: Valid Address, No Holders ---");
        const randomKp = Keypair.generate();
        console.log(`Address: ${randomKp.publicKey.toBase58()}`);
        try {
            await fetchHolderDistribution(randomKp.publicKey.toBase58());
        } catch (e) {
            console.log("Expected Error:", e.message);
        }

        // Test 3: Known Devnet Mint
        console.log("\n--- Test 3: Attempting with a devnet address ---");
        const devnetAddress = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"; // Common devnet dummy
        const result = await fetchHolderDistribution(devnetAddress);
        console.log("Result:", result);

    } catch (err) {
        console.error("Test error:", err.message);
    }
}
runTest();
