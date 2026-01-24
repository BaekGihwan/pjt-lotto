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
 * - excludeNumbers는 반드시 제거
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

function randomStrategy(fixedNumbers = [], excludeNumbers = []) {
    const fixedArr = uniqArray(fixedNumbers);
    const excludeArr = uniqArray(excludeNumbers);

    const numbers = [];

    for (let i = LOTTO_MIN; i <= LOTTO_MAX; i++) {
        if (fixedArr.includes(i) || excludeArr.includes(i)) continue;
        numbers.push(i);
    }

    const needNumbersCount = LOTTO_SIZE - fixedArr.length;

    if (numbers.length < needNumbersCount) {
        throw new Error('로또 번호 조합을 생성할 수 없습니다.');
    }

    const randomPicked = shuffleArray(numbers).slice(0, needNumbersCount);

    return [...fixedArr, ...randomPicked].sort((a, b) => a - b);
}

module.exports = {
    randomStrategy
};