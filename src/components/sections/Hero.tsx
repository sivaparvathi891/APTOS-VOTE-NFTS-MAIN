import { Button } from "@/components/ui/enhanced-button";
import { ArrowRight, Zap, Shield, Coins, Wallet } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import React, { useState, useEffect } from "react";

const API_URL = 'http://localhost:4000/api';

const Hero = () => {
  const [policies, setPolicies] = useState([]);
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarError, setAadhaarError] = useState('');
  const [policyVotes, setPolicyVotes] = useState({});
  const [votingPolicyId, setVotingPolicyId] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/policies`).then(res => res.json()).then(setPolicies);
  }, []);

  const handlePolicyVote = async (policyId, vote) => {
    if (!aadhaar || aadhaar.length !== 12) {
      setAadhaarError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setAadhaarError('');
    setVotingPolicyId(policyId);
    try {
      const res = await fetch(`${API_URL}/policy-vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar_number: aadhaar, policyId, vote })
      });
      if (res.status === 409) {
        setPolicyVotes(prev => ({ ...prev, [policyId]: vote }));
        setVotingPolicyId(null);
        return;
      }
      if (!res.ok) throw new Error('Vote failed');
      setPolicyVotes(prev => ({ ...prev, [policyId]: vote }));
    } catch {
      setAadhaarError('Voting failed. Try again.');
    } finally {
      setVotingPolicyId(null);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Web3 Governance Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            NFT-Powered
            <br />
            Governance
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Revolutionize decision-making with Aptos NFTs. One NFT equals one vote in a transparent, secure governance ecosystem.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/vote">
              <Button variant="hero" size="xl" asChild>
                <span className="flex items-center gap-2 animate-bounce">
                  Start Voting
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </a>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
            <Button variant="secondary" size="xl" className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:from-indigo-600 hover:to-blue-600 transition">
              <span className="flex items-center gap-2">
                Connect Wallet
                <Wallet className="w-5 h-5" />
              </span>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">1,247</h3>
              <p className="text-muted-foreground">Active Voters</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">156</h3>
              <p className="text-muted-foreground">Proposals Passed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3">
                <Coins className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">5,823</h3>
              <p className="text-muted-foreground">Governance NFTs</p>
            </div>
          </div>
          {/* Announcements Section */}
          <div className="relative z-10 container mx-auto px-4 mt-10 max-w-3xl">
            <h2 className="text-xl font-bold mb-4 text-left text-blue-800">Latest Announcements</h2>
            <ul className="mb-10 space-y-2 text-left">
              <li className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded shadow-sm text-blue-900">Voting for new government policies is now live!</li>
              <li className="bg-green-50 border-l-4 border-green-400 p-3 rounded shadow-sm text-green-900">Congratulations to the community for passing the Clean India proposal!</li>
              <li className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded shadow-sm text-yellow-900">Remember: One NFT = One Vote. Make your voice count.</li>
            </ul>
          </div>
          {/* Government Policies Section */}
          <div className="relative z-10 container mx-auto px-4 mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Current Government Policies</h2>
            <div className="mb-4 flex flex-col items-center">
              <input
                type="text"
                placeholder="Enter Aadhaar Number to vote (demo)"
                className="mb-2 px-4 py-2 border border-gray-300 rounded w-72 text-center"
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value)}
                maxLength={12}
              />
              {aadhaarError && <span className="text-red-600 text-sm">{aadhaarError}</span>}
            </div>
            <div className="space-y-6">
              {policies.map((policy) => (
                <div key={policy.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-200 hover:shadow-lg transition">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{policy.title}</h3>
                    <p className="text-gray-600 text-sm">{policy.description}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    {policyVotes[policy.id] ? (
                      <span className={`px-4 py-2 rounded font-semibold ${policyVotes[policy.id] === 'accept' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{policyVotes[policy.id] === 'accept' ? 'Accepted' : 'Rejected'}</span>
                    ) : (
                      <>
                        <button
                          className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                          onClick={() => handlePolicyVote(policy.id, 'accept')}
                          disabled={!aadhaar || votingPolicyId === policy.id}
                        >
                          Accept
                        </button>
                        <button
                          className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                          onClick={() => handlePolicyVote(policy.id, 'reject')}
                          disabled={!aadhaar || votingPolicyId === policy.id}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;