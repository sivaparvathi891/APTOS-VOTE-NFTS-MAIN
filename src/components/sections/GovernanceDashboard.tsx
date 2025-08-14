import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProposalCard from "./ProposalCard";
import NFTCard from "./NFTCard";
import { Plus, TrendingUp, Vote, Wallet } from "lucide-react";

// Mock data for demonstration
const proposals = [
  {
    title: "Increase Staking Rewards",
    description: "Proposal to increase staking rewards from 5% to 8% APY to incentivize more participation in governance.",
    status: "active" as const,
    endDate: "2 days left",
    votesFor: 847,
    votesAgainst: 123,
    totalVotes: 970,
  },
  {
    title: "New Partnership Agreement",
    description: "Strategic partnership with DeFi protocol to expand ecosystem utility and cross-chain capabilities.",
    status: "active" as const,
    endDate: "5 days left",
    votesFor: 1205,
    votesAgainst: 89,
    totalVotes: 1294,
    hasVoted: true,
  },
  {
    title: "Treasury Fund Allocation",
    description: "Allocate 500,000 APT from treasury for development grants and ecosystem growth initiatives.",
    status: "passed" as const,
    endDate: "Ended",
    votesFor: 2341,
    votesAgainst: 456,
    totalVotes: 2797,
  },
];

const myNFTs = [
  {
    id: "001",
    name: "Genesis Voter #1",
    image: "/placeholder.svg",
    rarity: "legendary" as const,
    votingPower: 3,
    collection: "Genesis DAO"
  },
  {
    id: "156",
    name: "Community Member #156",
    image: "/placeholder.svg",
    rarity: "rare" as const,
    votingPower: 2,
    collection: "Community NFTs"
  },
  {
    id: "789",
    name: "Governance Token #789",
    image: "/placeholder.svg",
    rarity: "common" as const,
    votingPower: 1,
    collection: "Standard Voting"
  },
];

const GovernanceDashboard = () => {
  const totalVotingPower = myNFTs.reduce((sum, nft) => sum + nft.votingPower, 0);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Governance Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Participate in decisions that shape the future of our ecosystem
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-secondary border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3">
                <Vote className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{totalVotingPower}</h3>
              <p className="text-muted-foreground">Your Voting Power</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-secondary border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{myNFTs.length}</h3>
              <p className="text-muted-foreground">NFTs Owned</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-secondary border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">12</h3>
              <p className="text-muted-foreground">Votes Cast</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-secondary border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-3">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">3</h3>
              <p className="text-muted-foreground">Proposals Created</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="proposals" className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList className="bg-muted/50 border border-border">
              <TabsTrigger value="proposals">Active Proposals</TabsTrigger>
              <TabsTrigger value="nfts">My NFTs</TabsTrigger>
              <TabsTrigger value="history">Voting History</TabsTrigger>
            </TabsList>
            
            <Button variant="hero">
              <Plus className="w-4 h-4" />
              Create Proposal
            </Button>
          </div>

          <TabsContent value="proposals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {proposals.map((proposal, index) => (
                <ProposalCard key={index} {...proposal} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myNFTs.map((nft) => (
                <NFTCard key={nft.id} {...nft} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Recent Voting Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <div>
                      <p className="font-medium">Treasury Fund Allocation</p>
                      <p className="text-sm text-muted-foreground">Voted: For • 3 votes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-400">Passed</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <div>
                      <p className="font-medium">New Partnership Agreement</p>
                      <p className="text-sm text-muted-foreground">Voted: For • 2 votes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-accent">Active</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default GovernanceDashboard;