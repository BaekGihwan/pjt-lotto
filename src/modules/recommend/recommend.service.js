/**
 * Recommend Service
 *
 * 핵심 비즈니스 로직 담당
 * 추천 전략 선택 및 티켓 생성 흐름 제어
 * validator에서 검증된 데이터를 기반으로 동작
 * 필요 시 repository를 통해 데이터 저장/조회
 *
 */

const crypto = require('crypto');
const { STRATEGY_MAP } = require('./strategies/index');
const repository = require('./recommend.repository');

/**
 * 추천 번호 생성 및 저장
 * @param {object} params - 검증된 요청 파라미터
 * @param {string} params.strategy - 추천 전략명
 * @param {number} params.count - 티켓 수
 * @param {Array<number>} params.fixedNumbers - 고정 번호
 * @param {Array<number>} params.excludeNumbers - 제외 번호
 * @returns {Promise<object>} 추천 결과
 */
async function recommendService({
    strategy = 'random',
    count = 1,
    fixedNumbers = [],
    excludeNumbers = []
} = {}) {

    const selectStrategy = STRATEGY_MAP[strategy];
    const ticketCount = Number.isInteger(count) ? count : parseInt(count, 10);

    // 임시데이터 지금 현재는 t_lotto_draw에 아무런 데이터가 없어서 임시로 데이터를 강제러 넣음
    let targetDrwNo = '1101';

    // 티켓 생성
    const tickets = [];
    for (let i = 0; i < ticketCount; i++) {
        tickets.push(
            selectStrategy.execute(fixedNumbers, excludeNumbers)
        );
    }

    // UUID 생성 nodejs 기본
    const recommendId = crypto.randomUUID();

    // targetDrwNo가 지정된 경우에만 DB 저장
    if (targetDrwNo > 0) {
        const paramsJson = {
            count: ticketCount,
            fixedNumbers,
            excludeNumbers
        };

        await repository.insertRecommendRun(recommendId, targetDrwNo, selectStrategy.key, paramsJson);
        await repository.insertRecommendNumbers(recommendId, tickets);
    }

    return {
        ok: true,
        recommendId,
        strategy,
        count,
        targetDrwNo,
        tickets
    };
}

module.exports = {
    recommendService
};
