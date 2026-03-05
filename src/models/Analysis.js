import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        required: true,
    },
    tokenAddress: {
        type: String,
        required: true,
    },
    riskScore: {
        type: Number,
        required: true,
    },
    mintAuthorityActive: {
        type: Boolean,
        required: true,
    },
    liquidity: {
        type: String,
        required: true,
    },
    supply: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
