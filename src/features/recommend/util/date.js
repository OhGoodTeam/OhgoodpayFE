// 월/일만 한국식으로 출력 (예: "2025-09-01T09:16:00" → "9월 1일")
const formatKRMonthDay = (input) => {
  if (!input) return "";

  // Date 객체도 허용
  if (input instanceof Date && !isNaN(input)) {
    return `${input.getMonth() + 1}월 ${input.getDate()}일`;
  }

  const s = String(input);

  // 이미 "8월 23일" 형식이면 그대로
  if (/^\s*\d{1,2}월\s*\d{1,2}일\s*$/.test(s)) return s.trim();

  // "YYYY-MM-DDTHH:mm:ss..." → 날짜부분만
  const datePart = s.includes("T") ? s.split("T")[0] : s;

  // YYYY[-./]MM[-./]DD
  let m = datePart.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) {
    const mm = Number(m[2]), dd = Number(m[3]);
    if (mm && dd) return `${mm}월 ${dd}일`;
  }

  // MM[-./]DD
  m = datePart.match(/^(\d{1,2})[-/.](\d{1,2})$/);
  if (m) {
    const mm = Number(m[1]), dd = Number(m[2]);
    if (mm && dd) return `${mm}월 ${dd}일`;
  }

  // 마지막 안전망
  const d = new Date(s);
  if (!isNaN(d)) return `${d.getMonth() + 1}월 ${d.getDate()}일`;

  return s; // 못 파싱하면 원문 반환
};

export { formatKRMonthDay };