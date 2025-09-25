// src/features/recommend/api/dashApi.js
import axiosInstance from './axiosInstance';

/* 공통: ApiResponseWrapper(success/code/message/data) */
const unwrap = (res) => {
  let data = res?.data;
  if (data && typeof data === 'object' && 'success' in data) {
    if (!data.success) {
      const msg = data.message || '요청 실패';
      throw new Error(msg);
    }
    data = data.data;
  }
  return data ?? {};
};

/**
 * AI 조언 데이터 가져오기
 * - 백엔드: POST /api/dash/advice
 * - 바디: {} (토큰 기반, customerId 불필요)
 */
export const fetchAIAdvice = async () => {
  try {
    const response = await axiosInstance.post('/api/dash/advice'); 
    const data = unwrap(response);

    const advices = Array.isArray(data.advices)
      ? data.advices.map((advice) => ({
          id: advice?.id ?? '',
          title: advice?.title ?? '',
          body: advice?.body ?? '',
          level: advice?.level ?? 'LOW',
          tags: Array.isArray(advice?.tags) ? advice.tags : [],
          refs: Array.isArray(advice?.refs) ? advice.refs : [],
        }))
      : [];

    return { advices, meta: data.meta ?? null };
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'AI 조언 로드 실패';
    throw new Error(message);
  }
};

/**
 * 오굿스코어 데이터 가져오기
 * - 백엔드: POST /api/dash/saymyname
 * - 바디: {} (토큰 기반)
 */
export const fetchOhgoodScore = async () => {
  try {
    const response = await axiosInstance.post('/api/dash/saymyname'); 
    const data = unwrap(response);

    return {
      score: Number(data.ohgoodScore ?? 0),
      message: typeof data.message === 'string' ? data.message : '',
    };
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || '오굿스코어 로드 실패';
    throw new Error(message);
  }
};

/**
 * 이번 달 BNPL 이용 내역 가져오기
 * - 백엔드: GET /api/dash/me/pay-this-month  (토큰 기반)
 */
export const fetchPayThisMonth = async () => {
  try {
    const response = await axiosInstance.get('/api/dash/me/pay-this-month'); // me 엔드포인트
    const data = unwrap(response);

    const amount = Number(data.sumTotalPrice ?? data.amount ?? data.bnplAmount ?? 0);
    const pointsThisMonth = Number(
      data.sumPointThisMonth ?? data.points ?? data.earnedPoints ?? 0
    );
    const rows = data.items ?? data.transactions ?? data.recentTransactions ?? [];

    const items = Array.isArray(rows)
      ? rows.map((item, index) => ({
          id: item.id ?? item.paymentId ?? index,
          date: item.date ?? item.dueDate ?? '',
          merchant: item.merchant ?? item.store ?? item.requestName ?? '가맹점',
          amount: Number(item.amount ?? item.totalPrice ?? 0),
          point: Number(item.point ?? 0),
        }))
      : [];

    return {
      month: data.month ?? '',
      amount,
      pointsThisMonth,
      pointBalance: Number(data.currentPointBalance ?? data.pointBalance ?? 0),
      items,
    };
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'BNPL 데이터 로드 실패';
    throw new Error(message);
  }
};

/**
 * 소비 패턴 분석 데이터 가져오기
 * - 백엔드: POST /api/dash/analyze
 * - 바디: { windowMonths } (토큰 기반)
 */
export const fetchSpendingAnalysis = async (monthsCount = 3) => {
  try {
    const response = await axiosInstance.post('/api/dash/analyze', {
      // customerId 생략(토큰 기반)
      windowMonths: monthsCount, // ✅ 백엔드 DTO 필드명에 맞춤
    });

    const wrapped = response.data;
    const data = unwrap({ data: wrapped });

    const body = data && typeof data === 'object' && 'data' in data ? data.data : data;
    const monthlyData = body?.monthly_data || {};
    const isSpringFormat = Array.isArray(body?.months) && body?.monthlyMap;

    let months = [];
    let monthlyMap = {};

    if (isSpringFormat) {
      // 스프링 포맷
      months = [...body.months].sort();
      months.forEach((month) => {
        const src = body.monthlyMap[month] || {};
        monthlyMap[month] = {
          totalSpend: Number(src.totalSpend ?? src.total_spend ?? 0),
          categories: Array.isArray(src.categories) ? src.categories : [],
        };
      });
    } else {
      // FastAPI 포맷
      months = Object.keys(monthlyData).sort();
      months.forEach((month) => {
        const monthData = monthlyData[month] || {};
        const categories = Object.entries(monthData.categories || {})
          .map(([name, value]) => ({
            name,
            amount: Number(value?.amount ?? 0),
            percentage: Math.round((Number(value?.share ?? 0) * 100) * 10) / 10,
            rank: value?.rank ?? null,
          }))
          .sort((a, b) => b.amount - a.amount);

        monthlyMap[month] = {
          totalSpend: Number(monthData.total_spend ?? 0),
          categories,
        };
      });
    }

    const dateRange = body?.summary?.date_range || body?.summary?.dateRange;
    let period = '';
    if (dateRange?.start && dateRange?.end) {
      const startMonth = dateRange.start.split('-')[1];
      const endMonth = dateRange.end.split('-')[1];
      period = `${startMonth}월 ~ ${endMonth}월`;
    }

    return {
      period,
      months,
      monthlyMap,
      selectedMonth: months[months.length - 1] || '',
    };
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || '소비 분석 데이터 로드 실패';
    throw new Error(message);
  }
};

const dashApi = {
  advice: fetchAIAdvice,
  sayMyName: fetchOhgoodScore,
  payThisMonth: fetchPayThisMonth,
  analyze: fetchSpendingAnalysis,
};
export default dashApi;
