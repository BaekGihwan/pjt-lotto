/**
 * Recommend Controller
 *
 * HTTP 요청(req/res)을 처리하는 계층
 * 요청 데이터 수신 후 validator, service 호출
 * 클라이언트에 요청에 맞게 응답 반환
 * 비즈니스 로직은 직접 처리하지 않음
 *
 */

// 검증 함수 가져오기
const {
    recommendValidatorRequest
} = require('./recommend.validator')

const {
    recommendService
} = require('./recommend.service')


// 기본 준비 /recommend
async function postRecommend(req, res) {
    try {
        // 1. 요청 데이터에 관련하여 검증
        const validResult = recommendValidatorRequest(req.body);

        // 2. 검증된 데이터로 비즈니스로직
        const result = await recommendService(validResult);

        // 3. 결과 반환
        return res.json(result);

    } catch (err) {
        return res.json({
            ok: false,
            message: err.message || '에러!!',
            status: err.status || 400,
            errors: err.details || []
        });
    }
}

module.exports = {
    postRecommend
};