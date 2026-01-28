/**
 * Draw Controller
 *
 * HTTP 요청(req/res)을 처리하는 계층
 * 요청 데이터 수신 후 validator, service 호출
 * 클라이언트에 요청에 맞게 응답 반환
 * 비즈니스 로직은 직접 처리하지 않음
 *
 */

const {
    getLatestDraw,
    getDrawByNo,
    syncDrawFromAPI
} = require('./draw.service');

const {
    AppError,
    errorCodes
} = require('../../common/errors');

// 회차 동기화 POST /draw/sync/:drwNo
async function syncDraw(req, res, next) {
    try {
        const {drwNo} = req.params;

        if (!drwNo || isNaN(drwNo)) {
            throw new AppError(errorCodes.DRAW_INVALID_DRW_NO);
        }

        const result = await syncDrawFromAPI(parseInt(drwNo, 10));
        return res.json(result);

    } catch (err) {
        next(err instanceof AppError ? err : new AppError(errorCodes.DRAW_SYNC_FAILED, err.message));
    }
}

// 최신 회차 조회 GET /draw/latest
async function getLatest(req, res, next) {
    try {
        const result = await getLatestDraw();

        if (!result) {
            throw new AppError(errorCodes.DRAW_NO_DATA);
        }

        return res.json(result);

    } catch (err) {
        next(err instanceof AppError ? err : new AppError(errorCodes.INTERNAL_ERROR, err.message));
    }
}

// 특정 회차 조회 GET /draw/:drwNo
async function getByDrwNo(req, res, next) {
    try {
        const {drwNo} = req.params;

        if (!drwNo || isNaN(drwNo)) {
            throw new AppError(errorCodes.DRAW_INVALID_DRW_NO);
        }

        const result = await getDrawByNo(parseInt(drwNo, 10));

        if (!result) {
            throw new AppError(errorCodes.DRAW_NOT_FOUND, `${drwNo}회`);
        }

        return res.json(result);

    } catch (err) {
        next(err instanceof AppError ? err : new AppError(errorCodes.INTERNAL_ERROR, err.message));
    }
}


module.exports = {
    syncDraw,
    getLatest,
    getByDrwNo
};
