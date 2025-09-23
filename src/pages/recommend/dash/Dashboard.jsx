import "./Dashboard.css";
import AIAdviceCard from '../../../features/recommend/component/dash/AIAdviceCard';
import OhgoodScoreCard from '../../../features/recommend/component/dash/OhgoodScoreCard';
import PayThisMonth from '../../../features/recommend/component/dash/PayThisMonth';
import SpendingAnalysisCard from '../../../features/recommend/component/dash/SpendingAnalysisCard';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <OhgoodScoreCard />
      <PayThisMonth />
      <SpendingAnalysisCard />
      <AIAdviceCard />
    </div>
  );
};

export default Dashboard;