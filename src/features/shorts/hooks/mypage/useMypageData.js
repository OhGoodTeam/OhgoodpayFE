import { useState, useEffect } from "react";
import axiosInstance from "../../../../shared/api/axiosInstance";

// 마이페이지 미리보기 전체 데이터 관리 (프로필 정보, 구독 미리보기, 영상 미리보기)
export const useMypageData = (userId = 1) => {
  const [mypageData, setMypageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMypageData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/shorts/mypage/${userId}/overview`
        );
        console.log("마이페이지 데이터:", response.data);
        setMypageData(response.data);
        setError(null);
      } catch (err) {
        console.error("마이페이지 데이터 로드 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMypageData();
  }, [userId]);

  const refresh = () => {
    const fetchMypageData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/shorts/mypage/${userId}/overview`
        );
        console.log("마이페이지 데이터:", response.data);
        setMypageData(response.data);
        setError(null);
      } catch (err) {
        console.error("마이페이지 데이터 로드 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMypageData();
  };

  return {
    mypageData,
    loading,
    error,
    refresh,
  };
};

export default useMypageData;
