import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import GovernanceDashboard from "@/components/sections/GovernanceDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <GovernanceDashboard />
    </div>
  );
};

export default Index;
