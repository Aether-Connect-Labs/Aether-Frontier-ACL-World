const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    username: String,
    firstName: String,
    lastName: String,
    balance: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    inventory: { type: [String], default: ['basic'] },
    equippedWeapon: { type: String, default: 'basic' },
    unlockedTrophies: { type: [String], default: [] },
    stats: {
        targetsShot: { type: Number, default: 0 },
        aetherCount: { type: Number, default: 0 }
    },
    walletAddress: { type: String, default: null },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
