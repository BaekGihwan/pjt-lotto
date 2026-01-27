/**
 * Draw Routes
 *
 * /draw 엔드포인트에 대한 HTTP 경로 설정
 * 요청을 controller로 전달하는 역할만 담당
 * API 라우팅 정의만 담당
 *
 */

const express = require('express');
const router = express.Router();

const drawController = require('./draw.controller');

router.post('/sync/:drwNo', drawController.syncDraw);
router.get('/:drwNo', drawController.getByDrwNo);
router.get('/latest', drawController.getLatest);

module.exports = router;