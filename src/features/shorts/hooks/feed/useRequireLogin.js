import { useNavigate } from "react-router-dom";
import callToken from "../../../../shared/hook/callToken";
export const useRequireLogin = () => {
  const navigate = useNavigate();

  const requireLogin = async () => {
    const token = await callToken();
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return false;
    }
    return true;
  };

  return { requireLogin };
};
