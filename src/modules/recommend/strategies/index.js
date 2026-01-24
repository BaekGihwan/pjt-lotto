const { randomStrategy } = require('./random.strategy');

// 전략 관련 맵
const STRATEGY_MAP = {
    random: {
        key: 'random',
        desc: '랜덤 추천(고정번호 포함/제외번호 반영)',
        execute: (fixedNumbers, excludeNumbers) => randomStrategy(fixedNumbers, excludeNumbers),
    },
};

function getStrategyNames() {
    return Object.keys(STRATEGY_MAP);
}

function hasStrategy(strategy) {
    return Boolean(STRATEGY_MAP[strategy]);
}

module.exports = {
    STRATEGY_MAP,
    getStrategyNames,
    hasStrategy,
};
