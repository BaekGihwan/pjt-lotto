/**
 * Random Recommend Strategy
 *
 * 랜덤 방식으로 로또 번호를 생성하는 전략
 * 외부 상태(DB, req/res)에 의존하지 않는 순수 함수
 * 추천 알고리즘 로직만 담당
 *
 */


/**
 * 랜덤 추천 전략(step 1-1)
 *
 * 규칙
 * - 1~45 중 중복 없이 6개 생성
 * - 결과는 오름차순 정렬
 */

const {shuffleArray} = require('../../../common/utils');

const LOTTO_MIN = 1;
const LOTTO_MAX = 45;
const LOTTO_SIZE = 6;

function randomStrategy() {
    const numbers = [];
    for (let i = LOTTO_MIN; i <= LOTTO_MAX; i++) {
        numbers.push(i);
    }

    // 1~45 numbers에서 중복 없이 6개를 랜덤으로 선택해 오름차순 정렬
    return shuffleArray(numbers)
        .slice(0, LOTTO_SIZE)
        .sort((a, b) => a - b);
}

module.exports = {
    randomStrategy
};