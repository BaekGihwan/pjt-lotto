/**
 * Random Recommend Strategy
 *
 * 랜덤 방식으로 로또 번호를 생성하는 전략
 * 외부 상태(DB, req/res)에 의존하지 않는 순수 함수
 * 추천 알고리즘 로직만 담당
 *
 */


/**
 * 랜덤 추천 전략(step 1-2)
 *
 * 규칙
 * - fixedNumbers는 반드시 포함
 * - 1~45 중 중복 없이 6개 생성
 * - 결과는 오름차순 정렬
 */

const {
    shuffleArray,
    uniqArray
} = require('../../../common/utils');

const LOTTO_MIN = 1;
const LOTTO_MAX = 45;
const LOTTO_SIZE = 6;

function randomStrategy(fixedNumbers = []) {
    const fixedArr = uniqArray(fixedNumbers);

    if (fixedArr.length > LOTTO_SIZE) {
        throw new Error("fixedNumbers는 최대 6개 까지 가능 합니다.");
    }

    const numbers = [];

    for (let i = LOTTO_MIN; i <= LOTTO_MAX; i++) {
        if (!fixedArr.includes(i)) {
            numbers.push(i);
        }
    }

    const needNumbersCount = LOTTO_SIZE - fixedArr.length;

    const randomPicked = shuffleArray(numbers).slice(0, needNumbersCount);

    return [...fixedArr, ...randomPicked].sort((a, b) => a - b);
}

module.exports = {
    randomStrategy
};