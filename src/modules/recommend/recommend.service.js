/**
 * Recommend Service
 *
 * 핵심 비즈니스 로직 담당
 * 추천 전략 선택 및 티켓 생성 흐름 제어
 * validator에서 검증된 데이터를 기반으로 동작
 * 필요 시 repository를 통해 데이터 저장/조회
 *
 */

const { STRATEGY_MAP } = require('./strategies/index');

function recommendService({
                              strategy = 'random',
                              count = 1,
                              fixedNumbers = [],
                              excludeNumbers = []
                          } = {}) {

    const selectStrategy = STRATEGY_MAP[strategy];

    const ticketCount = Number.isInteger(count) ? count : parseInt(count, 10);

    const tickets = [];
    for (let i = 0; i < ticketCount; i++) {
        tickets.push(
            selectStrategy.execute(fixedNumbers, excludeNumbers)
        );
    }

    return {
        ok: true,
        strategy,
        count,
        tickets
    };
}

module.exports = {
    recommendService
};