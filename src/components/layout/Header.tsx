
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/enhanced-button";
import { Wallet, Vote, Users, ChevronDown } from "lucide-react";

const Header = () => {
  const { account, connected, connect, disconnect, isLoading } = useWallet();
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Vote className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AptosDAO
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#governance" className="text-muted-foreground hover:text-foreground transition-colors">
            Governance
          </a>
          <a href="#proposals" className="text-muted-foreground hover:text-foreground transition-colors">
            Proposals
          </a>
          <a href="#nfts" className="text-muted-foreground hover:text-foreground transition-colors">
            My NFTs
          </a>
          <a href="#analytics" className="text-muted-foreground hover:text-foreground transition-colors">
            Analytics
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Users className="w-4 h-4" />
            Community
            <ChevronDown className="w-3 h-3" />
          </Button>
            {connected ? (
              <Button variant="hero" size="sm" onClick={disconnect}>
                <Wallet className="w-4 h-4" />
                {account?.address ? `${String(account.address).slice(0, 6)}...${String(account.address).slice(-4)}` : ''}
              </Button>
            ) : (
              <Button variant="hero" size="sm" onClick={() => connect('Petra')} disabled={isLoading}>
                <Wallet className="w-4 h-4" />
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;