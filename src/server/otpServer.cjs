const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Policy voting schema
const policyVoteSchema = new mongoose.Schema({
  aadhaar_number: String,
  policyId: String,
  vote: String // 'accept' or 'reject'
});
const PolicyVote = mongoose.model('PolicyVote', policyVoteSchema);

// List of policies (could be in DB, but static for now)
const POLICIES = [
  { id: 'digital-india', title: 'Digital India Initiative', description: 'A campaign to improve online infrastructure and increase internet connectivity.' },
  { id: 'swachh-bharat', title: 'Swachh Bharat Abhiyan', description: 'A nationwide campaign for cleanliness and sanitation.' },
  { id: 'make-in-india', title: 'Make in India', description: 'An initiative to encourage companies to manufacture in India.' },
  { id: 'ayushman-bharat', title: 'Ayushman Bharat', description: 'A health insurance scheme for underprivileged citizens.' }
];

// Get all policies (for frontend)
app.get('/api/policies', (req, res) => {
  res.json(POLICIES);
});

// Vote on a policy
app.post('/api/policy-vote', async (req, res) => {
  const { aadhaar_number, policyId, vote } = req.body;
  if (!aadhaar_number || !policyId || !['accept', 'reject'].includes(vote)) return res.status(400).json({ error: 'Invalid input' });
  try {
    // Prevent multiple votes per user per policy
    const existing = await PolicyVote.findOne({ aadhaar_number, policyId });
    if (existing) return res.status(409).json({ error: 'Already voted for this policy' });
    await PolicyVote.create({ aadhaar_number, policyId, vote });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Voting failed' });
  }
});
app.use(express.json());
app.use(cors());

const DATA_PATH = __dirname + '/../data/aadhaar.json';
let otps = {};

// Register new Aadhaar dynamically
app.post('/api/register', (req, res) => {
  const { aadhaar_number, name, phone } = req.body;
  if (!aadhaar_number || !name || !phone) return res.status(400).json({ error: 'Missing fields' });
  let users = JSON.parse(fs.readFileSync(DATA_PATH));
  if (users.find(u => u.aadhaar_number === aadhaar_number)) return res.status(409).json({ error: 'Aadhaar already exists' });
  users.push({ aadhaar_number, name, phone, hasVoted: false });
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
  res.json({ success: true, message: 'Aadhaar registered' });
});

// Simulate Aadhaar scan and send OTP
app.post('/api/send-otp', (req, res) => {
  const { aadhaar_number } = req.body;
  const users = JSON.parse(fs.readFileSync(DATA_PATH));
  const user = users.find(u => u.aadhaar_number === aadhaar_number);
  if (!user) return res.status(404).json({ error: 'Aadhaar not found' });
  if (user.hasVoted) return res.status(403).json({ error: 'Already voted' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[aadhaar_number] = otp;
  // In real app, send OTP to user.phone. Here, return for demo
  res.json({ otp, message: `OTP sent to ${user.phone}` });
});

// Verify OTP and allow voting
app.post('/api/verify-otp', async (req, res) => {
  const { aadhaar_number, otp } = req.body;
  if (otps[aadhaar_number] !== otp) return res.status(401).json({ error: 'Invalid OTP' });
  // Mark as voted
  let users = JSON.parse(fs.readFileSync(DATA_PATH));

  // MongoDB-based voting logic
  try {
    const user = await User.findOne({ aadhaar_number });
    if (!user) return res.status(404).json({ error: 'Aadhaar not found' });
    if (user.hasVoted) return res.status(403).json({ error: 'Already voted' });
    user.hasVoted = true;
    await user.save();
    delete otps[aadhaar_number];
    res.json({ success: true, message: 'Vote allowed' });
  } catch (e) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

app.listen(4000, () => console.log('OTP server running on port 4000'));
