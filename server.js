require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://academicchain_app:AcademicChain2024@aeternum.xzjnm1a.mongodb.net/?appName=aeternum';

// Connection Caching for Serverless (Vercel)
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    
    // Check if we have a connection state
    if (mongoose.connection.readyState === 1) {
        cachedDb = mongoose.connection;
        return cachedDb;
    }

    await mongoose.connect(MONGO_URI, {
        dbName: 'telegram_db',
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    cachedDb = mongoose.connection;
    console.log('✅ MongoDB Connected to telegram_db');
    return cachedDb;
}

// Ensure connection before handling requests
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).send("Database Error");
    }
});

// --- API Endpoints ---

// Get User Data (Load Game)
app.get('/api/user/:telegramId', async (req, res) => {
    try {
        const { telegramId } = req.params;
        let user = await User.findOne({ telegramId });
        
        if (!user) {
            // Create new user if not exists (optional, or handle in save)
            // For now, return 404 or null so frontend knows to init defaults
            return res.json({ exists: false });
        }
        
        res.json({ exists: true, data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Save User Data
app.post('/api/save', async (req, res) => {
    try {
        const { telegramId, username, firstName, lastName, state, walletAddress } = req.body;
        
        if (!telegramId) return res.status(400).json({ error: 'Missing telegramId' });

        // Upsert user
        const updatedUser = await User.findOneAndUpdate(
            { telegramId },
            {
                telegramId,
                username,
                firstName,
                lastName,
                balance: state.balance,
                level: state.level,
                inventory: state.inventory,
                equippedWeapon: state.equippedWeapon,
                unlockedTrophies: state.unlockedTrophies,
                stats: {
                    targetsShot: state.targetsShot,
                    aetherCount: state.aetherCount
                },
                walletAddress: walletAddress || undefined, // Only update if provided
                lastUpdated: Date.now()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({ success: true, data: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Save Failed' });
    }
});

// Fallback for SPA (if needed, but simple static serve is enough for now)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// For Vercel, we export the app
module.exports = app;

// Only listen if run directly (Render/Local)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}
