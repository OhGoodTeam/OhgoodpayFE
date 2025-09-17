import axiosInstance from "../../../shared/api/axiosInstance";

/**
 * PIN 코드 유효성 검증
 * - 백엔드: POST /api/payment/validate
 * - 요청 본문: { codeType: "pincode", value: <입력PIN>, customerId }
 * - 성공: 결제 모달에 필요한 데이터 반환
 * - 실패: 백엔드 에러 메시지를 해석해 일관된 에러로 throw
 */
export const validatePinCode = async (pin, customerId) => {
  try {
    const response = await axiosInstance.post("/api/payment/validate", {
      codeType: "pincode",
      value: pin,
    });
    return response.data;
  } catch (error) {
    const raw = error?.response?.data?.message || "";

    // 백엔드 예외 메시지 패턴 매핑 (없음/만료/요청 없음 등)
    const isInvalid =
      /코드\s*만료|PIN\s*없음|QR\s*없음|요청\s*없음/i.test(raw) ||
      error?.response?.status === 404 ||
      error?.response?.status === 400 ||
      error?.response?.status === 410;

    if (isInvalid) {
      throw new Error("유효하지않은 코드입니다.");
    }
    throw new Error("핀코드 인증 실패");
  }
};

/**
 * 최종 결제 요청
 * - 백엔드: POST /api/payment/final
 *   params 옵션으로 쿼리스트링을 전달
 * - 성공: { success:true, result:true, ... } 형태
 * - 실패: 백엔드 메시지 또는 기본 메시지로 throw
 */
export const finalPayment = async ({ point, requestId }) => {
  try {
    const response = await axiosInstance.post(
      "/api/payment/final", // 백엔드 매핑 URL
      null, // @RequestParam이므로 body는 없음
      {
        params: { point, requestId }, // 쿼리 파라미터로 전달
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "결제 요청 실패");
  }
};
