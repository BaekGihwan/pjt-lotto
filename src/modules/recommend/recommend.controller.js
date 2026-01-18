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


// 기본 준비 /recommend
function postRecommend(req, res) {
    try {
        const result = recommendValidatorRequest(req.body);

        res.json({
            ok: true,
            strategy: result.strategy,
            message: '데이터 검증 확인',
            received: result
        });
    } catch (err) {
        res.json({
            ok: false,
            message: err.message,
            errors: err.details || []
        });
    }
}

module.exports = {
    postRecommend
};