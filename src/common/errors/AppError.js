/**
 * AppError
 *
 * 애플리케이션 커스텀 에러 클래스
 * errorCodes와 함께 사용하여 일관된 에러 응답 생성
 *
 */

class AppError extends Error {
    /**
     * @param {object} errorCode - errorCodes.js에서 정의된 에러 코드 객체
     * @param {string|null} detail - 추가 상세 정보 (선택)
     */
    constructor(errorCode, detail = null) {
        super(errorCode.message);
        this.name = 'AppError';
        this.code = errorCode.code;
        this.status = errorCode.status;
        this.detail = detail;

        // 스택 트레이스 캡처
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * JSON 응답 형태로 변환
     * @returns {object} 에러 응답 객체
     */
    toJSON() {
        const response = {
            result: false,
            code: this.code,
            message: this.message
        };

        if (this.detail) {
            response.detail = this.detail;
        }

        return response;
    }
}

module.exports = AppError;
