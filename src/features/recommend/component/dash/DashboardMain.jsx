import OhgoodScoreCard from "./OhgoodScoreCard";
import PayThisMonth from "./PayThisMonth";
import SpendingAnalysisCard from "./SpendingAnalysisCard";
import Advice from "./AIAdviceCard";
import "./DashboardMain.css";

const DashboardMain = () => {
  const customerId = 1; // TODO: 로그인 연동 시 교체

  return (
    <section className="dash-grid">
      {/* Row 1: 1/2 + 1/2 */}
      <OhgoodScoreCard customerId={customerId} />
      <PayThisMonth customerId={customerId} />

      {/* Row 2: span-2 (소비 패턴 분석) */}
      <div className="span-2">
        <SpendingAnalysisCard customerId={customerId} />
      </div>

      {/* Row 3: span-2 (AI 조언) */}
      <div className="span-2">
        <Advice customerId={customerId} />
      </div>
    </section>
  );
};

export default DashboardMain;
