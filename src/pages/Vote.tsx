

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

// Simple bar chart component
function BarChart({ proposals }: { proposals: { description: string; votes: number }[] }) {
  const maxVotes = Math.max(1, ...proposals.map(p => p.votes));
  return (
    <div className="space-y-2 mt-6">
      {proposals.map((p, i) => (
        <div key={i}>
          <div className="flex justify-between mb-1">
            <span className="font-medium text-gray-700">{p.description}</span>
            <span className="text-gray-500">{p.votes} votes</span>
          </div>
          <div className="h-4 bg-gray-200 rounded">
            <div
              className="h-4 bg-blue-500 rounded"
              style={{ width: `${(p.votes / maxVotes) * 100}%`, minWidth: 8 }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}

const API_URL = 'http://localhost:4000/api';


export default function Vote() {
  const [aadhaar, setAadhaar] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [step, setStep] = useState<'aadhaar' | 'register' | 'otp' | 'voting' | 'voted'>('aadhaar');
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [proposals, setProposals] = useState<{ description: string; votes: number }[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [voting, setVoting] = useState<boolean>(false);

  // Mock proposals (replace with backend fetch if needed)
  useEffect(() => {
    // Real-time government voting options
    setProposals([
      { description: 'BJP', votes: 5 },
      { description: 'Congress', votes: 3 },
      { description: 'Others', votes: 2 },
    ]);
  }, []);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar_number: aadhaar })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'Aadhaar not found') {
          setStep('register');
          toast({ title: 'Aadhaar Not Found', description: 'Please register your Aadhaar.' });
          return;
        }
        throw new Error(data.error || 'Failed to send OTP');
      }
      setOtpSent(true);
      setStep('otp');
      toast({ title: 'OTP Sent', description: data.message });
      toast({ title: 'Demo OTP', description: data.otp });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await handleSendOtp();
      setOtp('');
    } finally {
      setResendLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar_number: aadhaar, name, phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      toast({ title: 'Registered', description: 'Aadhaar registered. Sending OTP...' });
      setStep('aadhaar');
      setTimeout(handleSendOtp, 500); // Automatically send OTP after registration
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar_number: aadhaar, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        setOtp(''); // Clear OTP if wrong
        throw new Error(data.error || 'OTP verification failed');
      }
      setStep('voting');
      toast({ title: 'Success', description: 'You can now vote!' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Card className="w-full max-w-lg p-10 shadow-2xl border border-gray-200 rounded-xl bg-white">
        <div className="flex flex-col items-center mb-8">
          <img src="/aadhaar.svg" alt="Aadhaar Card" className="w-16 h-12 mb-2" />
          <h2 className="text-3xl font-serif font-bold mb-2 text-gray-800 tracking-wide">Aadhaar Voting Portal</h2>
          <p className="text-gray-500 text-center text-base">Secure, one-person-one-vote. Enter your Aadhaar and OTP to participate.</p>
        </div>
        <div className="space-y-6">
          {step === 'aadhaar' && (
            <>
              <label className="block text-lg font-medium text-gray-700 mb-2">Aadhaar Number</label>
              <Input
                placeholder="Enter 12-digit Aadhaar Number"
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value)}
                maxLength={12}
                className="mb-2 text-lg px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Button onClick={handleSendOtp} disabled={loading || aadhaar.length !== 12} className="w-full text-lg py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </>
          )}
          {step === 'otp' && (
            <>
              <label className="block text-lg font-medium text-gray-700 mb-2">OTP</label>
              <Input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                className="mb-2 text-lg px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <div className="flex gap-2">
                <Button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} className="flex-1 text-lg py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold">
                  {loading ? 'Verifying...' : 'Verify OTP & Vote'}
                </Button>
                <Button onClick={handleResendOtp} disabled={resendLoading} variant="outline" className="flex-1 text-lg py-2 rounded border-blue-600 text-blue-600 hover:bg-blue-50">
                  {resendLoading ? 'Resending...' : 'Resend OTP'}
                </Button>
              </div>
            </>
          )}
          {step === 'register' && (
            <>
              <label className="block text-lg font-medium text-gray-700 mb-2">Register Aadhaar</label>
              <Input
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="mb-2 text-lg px-4 py-2 border border-gray-300 rounded"
              />
              <Input
                placeholder="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="mb-2 text-lg px-4 py-2 border border-gray-300 rounded"
              />
              <Button onClick={handleRegister} disabled={loading || !name || !phone} className="w-full text-lg py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                {loading ? 'Registering...' : 'Register & Send OTP'}
              </Button>
            </>
          )}
          {step === 'voting' && (
            <>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Vote on a Proposal</h3>
              <div className="space-y-4">
                {proposals.map((p, i) => (
                  <div key={i} className="flex items-center justify-between border rounded p-3">
                    <span className="font-medium text-gray-700 flex items-center gap-2">
                      {p.description === 'BJP' && <img src="/bjp.svg" alt="BJP" className="w-6 h-6" />}
                      {p.description === 'Congress' && <img src="/congress.svg" alt="Congress" className="w-6 h-6" />}
                      {p.description === 'Others' && <img src="/others.svg" alt="Others" className="w-6 h-6" />}
                      {p.description}
                    </span>
                    <Button
                      variant={selectedProposal === i ? 'default' : 'outline'}
                      disabled={voting || selectedProposal !== null}
                      onClick={async () => {
                        setVoting(true);
                        setSelectedProposal(i);
                        // Simulate vote (replace with backend/chain call)
                        setTimeout(() => {
                          setProposals(prev => prev.map((pr, idx) => idx === i ? { ...pr, votes: pr.votes + 1 } : pr));
                          setStep('voted');
                          setVoting(false);
                          toast({ title: 'Vote Cast', description: `You voted for "${p.description}"` });
                        }, 1000);
                      }}
                    >
                      {selectedProposal === i ? (voting ? 'Voting...' : 'Voted') : 'Vote'}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
          {step === 'voted' && (
            <>
              <div className="text-green-700 text-center font-serif text-xl font-semibold py-8">
                <svg className="mx-auto mb-4" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                You have successfully voted! Thank you for participating in democracy.
              </div>
              <BarChart proposals={proposals} />
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
