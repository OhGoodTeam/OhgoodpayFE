import "./App.css";
import Footer from "./shared/components/Footer";
import Header from "./shared/components/Header";
import ConfirmedModal from "./shared/components/ConfirmedModal";
function App() {
  return (
    <>
      <Header />
      <ConfirmedModal text="결제 완료됐습니다." />
      <Footer type="main" selected="home" />
    </>
  );
}

export default App;
