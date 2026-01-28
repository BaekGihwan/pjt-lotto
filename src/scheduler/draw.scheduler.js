/**
 * Draw Scheduler
 *
 * 로또 회차 정보 자동 동기화 스케줄러
 * 매주 토요일 21:20 KST에 실행
 * 동행복권 API에서 최신 당첨 정보 조회
 *
 */

const cron = require('node-cron');
const drawService = require('../modules/draw/draw.service');
const drawRepository = require('../modules/draw/draw.repository');

/**
 * 다음 동기화할 회차 번호 계산
 * @returns {Promise<number>} 다음 회차 번호
 */
async function getNextDrwNo() {
    const latestDraw = await drawRepository.findLatestDraw();

    if (!latestDraw) {
        return 1;
    }

    return latestDraw.drw_no + 1;
}

/**
 * 회차 동기화 실행
 */
async function syncLatestDraw() {
    const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    console.log(`[${timestamp}] 회차 동기화 스케줄러 실행`);

    try {
        const nextDrwNo = await getNextDrwNo();
        console.log(`[${timestamp}] 동기화 대상 회차: ${nextDrwNo}`);

        const result = await drawService.syncDrawFromAPI(nextDrwNo);
        console.log(`[${timestamp}] 동기화 완료:`, result.message);

        return result;

    } catch (err) {
        console.error(`[${timestamp}] 동기화 실패:`, err.message);
        return {
            result: false,
            message: err.message
        };
    }
}

/**
 * 스케줄러 시작
 * 매주 토요일 21:20 KST 실행
 */
function start() {
    // Cron: 분 시 일 월 요일 (0=일요일, 6=토요일)
    // '20 21 * * 6' = 매주 토요일 21:20
    const schedule = '20 21 * * 6';

    cron.schedule(schedule, syncLatestDraw, {
        timezone: 'Asia/Seoul'
    });

    console.log('[Draw Scheduler] 스케줄러 시작 - 매주 토요일 21:20 KST');
}

module.exports = {
    start,
};
