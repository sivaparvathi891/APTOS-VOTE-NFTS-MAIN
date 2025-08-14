import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, CheckCircle, XCircle } from "lucide-react";

interface ProposalCardProps {
  title: string;
  description: string;
  status: "active" | "passed" | "rejected" | "pending";
  endDate: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  hasVoted?: boolean;
}

const ProposalCard = ({
  title,
  description,
  status,
  endDate,
  votesFor,
  votesAgainst,
  totalVotes,
  hasVoted = false,
}: ProposalCardProps) => {
  const percentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
  
  const statusConfig = {
    active: { color: "bg-accent text-accent-foreground", icon: Clock },
    passed: { color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle },
    rejected: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
    pending: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock },
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <Card className="bg-card border-border hover:shadow-hover transition-all duration-300 hover:border-accent/30">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge className={`${statusConfig[status].color} border`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {endDate}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-400">For: {votesFor}</span>
            <span className="text-red-400">Against: {votesAgainst}</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{percentage.toFixed(1)}% approval</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {totalVotes} votes
            </div>
          </div>
        </div>
        
        {status === "active" && !hasVoted && (
          <div className="flex gap-2 pt-2">
            <Button variant="vote" size="sm" className="flex-1 bg-green-500/10 text-green-400 hover:bg-green-500/20">
              Vote For
            </Button>
            <Button variant="vote" size="sm" className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20">
              Vote Against
            </Button>
          </div>
        )}
        
        {hasVoted && (
          <div className="text-center text-sm text-accent py-2">
            ✓ You have voted on this proposal
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalCard;