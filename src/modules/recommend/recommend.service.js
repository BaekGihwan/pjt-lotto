/**
 * Recommend Service
 *
 * 핵심 비즈니스 로직 담당
 * 추천 전략 선택 및 티켓 생성 흐름 제어
 * validator에서 검증된 데이터를 기반으로 동작
 * 필요 시 repository를 통해 데이터 저장/조회
 *
 */

/**
 * 랜덤 추천 전략(step 1-4)
 *
 * 규칙
 * - fixedNumbers는 반드시 포함
 * - excludeNumbers는 반드시 제거
 * - count 만큼 티켓 생성
 * - 1~45 중 중복 없이 6개 생성
 * - 결과는 오름차순 정렬
 */

const {randomStrategy} = require('./strategies/random.strategy');

function recommendService({
                              strategy = 'random',
                              count = 1,
                              fixedNumbers = [],
                              excludeNumbers = []
                          } = {}) {

    const ticketCount = Number.isInteger(count) ? count : parseInt(count, 10);

    const tickets = [];
    for (let i = 0; i < ticketCount; i++) {
        tickets.push(randomStrategy(fixedNumbers, excludeNumbers));
    }

    return {
        ok: true,
        strategy,
        tickets
    };
}

module.exports = {
    recommendService
};