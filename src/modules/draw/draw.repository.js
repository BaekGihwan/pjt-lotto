/**
 * Draw Repository
 *
 * 로또 회차(동행복권) 관련 데이터의 영속성 처리를 담당
 * DB 조회/저장 등 데이터 접근 로직만 포함
 * 비즈니스 로직이나 HTTP 처리 로직은 포함하지 않음
 *
 */

const db = require('../../congif/db');

/**
 * 회차 저장
 * @param {number} drwNo - 회차 번호
 * @param {string} drwDate - 추첨일 (YYYY-MM-DD)
 * @returns {Promise<object>} insert 결과
 */
async function insertDraw(drwNo, drwDate) {
    const sql = `
        INSERT INTO t_lotto_draw (drw_no, drw_date)
        VALUES (?, ?) ON DUPLICATE KEY
        UPDATE drw_date = VALUES (drw_date)
    `;
    return db.query(sql, [drwNo, drwDate]);
}

/**
 * 최신 회차 조회 (가장 큰 drw_no)
 * @returns {Promise<object|null>} 최신 회차 정보
 */
async function findLatestDraw() {
    const sql = `
        SELECT drw_no, drw_date, created_date
        FROM t_lotto_draw
        ORDER BY drw_no
        DESC LIMIT 1
    `;
    const rows = await db.query(sql);
    return rows.length > 0 ? rows[0] : null;
}

/**
 * 특정 회차 조회
 * @param {number} drwNo - 회차 번호
 * @returns {Promise<object|null>} 회차 정보
 */
async function findDrawByNo(drwNo) {
    const sql = `
        SELECT drw_no, drw_date, created_date
        FROM t_lotto_draw
        WHERE drw_no = ?
    `;
    const rows = await db.query(sql, [drwNo]);
    return rows.length > 0 ? rows[0] : null;
}

module.exports = {
    insertDraw,
    findLatestDraw,
    findDrawByNo,
};
