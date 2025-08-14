import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Star } from "lucide-react";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  votingPower: number;
  collection: string;
}

const NFTCard = ({ id, name, image, rarity, votingPower, collection }: NFTCardProps) => {
  const rarityConfig = {
    common: { 
      color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      icon: Star,
      glow: "hover:shadow-gray-500/20"
    },
    rare: { 
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: Zap,
      glow: "hover:shadow-blue-500/30"
    },
    epic: { 
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: Crown,
      glow: "hover:shadow-purple-500/30"
    },
    legendary: { 
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      icon: Crown,
      glow: "hover:shadow-yellow-500/40"
    },
  };

  const RarityIcon = rarityConfig[rarity].icon;

  return (
    <Card className={`bg-card border-border hover:shadow-card transition-all duration-300 hover:border-accent/30 hover:scale-105 ${rarityConfig[rarity].glow} group cursor-pointer`}>
      <CardContent className="p-4 space-y-3">
        <div className="relative">
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover rounded-lg bg-muted"
          />
          <Badge className={`absolute top-2 right-2 ${rarityConfig[rarity].color} border`}>
            <RarityIcon className="w-3 h-3 mr-1" />
            {rarity}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">{collection}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">ID: #{id}</span>
            <div className="text-right">
              <div className="text-sm font-medium text-accent">{votingPower} Vote{votingPower !== 1 ? 's' : ''}</div>
              <div className="text-xs text-muted-foreground">Voting Power</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCard;