const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const DATA_PATH = __dirname + '/../data/aadhaar.json';
let otps = {};

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
app.post('/api/verify-otp', (req, res) => {
  const { aadhaar_number, otp } = req.body;
  if (otps[aadhaar_number] !== otp) return res.status(401).json({ error: 'Invalid OTP' });
  // Mark as voted
  let users = JSON.parse(fs.readFileSync(DATA_PATH));
  const idx = users.findIndex(u => u.aadhaar_number === aadhaar_number);
  if (idx === -1) return res.status(404).json({ error: 'Aadhaar not found' });
  if (users[idx].hasVoted) return res.status(403).json({ error: 'Already voted' });
  users[idx].hasVoted = true;
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
  delete otps[aadhaar_number];
  res.json({ success: true, message: 'Vote allowed' });
});

app.listen(4000, () => console.log('OTP server running on port 4000'));
