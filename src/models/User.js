import mongoose from 'mongoose';

/**
 * Mongoose schema for KOFFEE users. 
 * Per requirements, we ONLY store the public key for risk-awareness and security.
 * The private key is never saved in the database.
 */
const userSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        required: true,
        unique: true,
    },
    walletPublicKey: {
        type: String,
        required: false, // In case a user starts the bot but hasn't created a wallet yet
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const User = mongoose.model('User', userSchema);
