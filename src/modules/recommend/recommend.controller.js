/**
 * Recommend Controller
 *
 * HTTP 요청(req/res)을 처리하는 계층
 * 요청 데이터 수신 후 validator, service 호출
 * 클라이언트에 요청에 맞게 응답 반환
 * 비즈니스 로직은 직접 처리하지 않음
 *
 */

// 기본 준비 /recommend
function postRecommend(req, res) {
    res.json({
        ok: true,
        message: '추천 모듈 준비'
    });
}


module.exports = {
    postRecommend
};