// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// 1) Middleware
app.use(cors());
app.use(express.json());

// 2) Connect to MongoDB
// — your connection string:
const MONGO_URI = 'mongodb://localhost:27017/walletDB';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 3) Define a schema & model
const walletSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  balance:       { type: Number, required: true },
  websiteBalance:  { type: Number, required: true },    // your site‑wallet balance
  updatedAt:     { type: Date, default: Date.now },
});
const Wallet = mongoose.model('Wallet', walletSchema);

// 4) Define your POST endpoint
app.post('/api/store-wallet', async (req, res) => {
  try {
    const { walletAddress, ethBalance, websiteWalletBalance } = req.body;
    // ethBalance may come as "1.23 ETH" — strip non‑digits:
    const balance = parseFloat(ethBalance.toString().replace(/[^\d.]/g, '')) || 0;

    const siteBalance = Number(websiteWalletBalance) || 0;

    // Upsert so repeated calls update the same doc
    const doc = await Wallet.findOneAndUpdate(
      { walletAddress },
      { balance,
        websiteBalance: siteBalance, 
        updatedAt: new Date() },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/wallet/:walletAddress', async (req, res) => {
    try {
      // normalize to lowercase so casing mismatches don’t break the lookup
      const address = req.params.walletAddress.toLowerCase();
      const doc = await Wallet.findOne({ walletAddress: address });
      if (!doc) {
        // 404 if not found; front‑end will know to fall back to Etherscan
        return res.status(404).json({ success: false, error: 'Not found' });
      }
      // send back the full document
      res.json({ success: true, data: doc });
    } catch (err) {
      console.error('Lookup error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

// 5) Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`));