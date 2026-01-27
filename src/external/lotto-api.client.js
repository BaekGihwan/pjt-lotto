/**
 * Lotto API Client
 *
 * 동행복권 외부 API 호출을 담당
 * https://www.dhlottery.co.kr 에서 당첨 정보 조회
 *
 */

/**
 * 특정 회차 당첨 정보 조회
 * @param {number} drwNo - 회차 번호
 * @returns {Promise<object>} 당첨 정보
 */
async function fetchDraw(drwNo) {
    const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const error = new Error(`동행복권 API 호출 실패: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    const data = await response.json();

    if (data.returnValue !== 'success') {
        const error = new Error(`회차 정보 없음: ${drwNo}회`);
        error.status = 404;
        throw error;
    }

    return {
        drwNo: data.drwNo,
        drwDate: data.drwNoDate,
        numbers: [
            data.drwtNo1,
            data.drwtNo2,
            data.drwtNo3,
            data.drwtNo4,
            data.drwtNo5,
            data.drwtNo6
        ],
        bonusNo: data.bnusNo
    };
}

module.exports = {
    fetchDraw
};
