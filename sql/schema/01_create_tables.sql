-- =========================================================
-- 01_create_tables.sql
-- 목적: 테이블 생성 (PK/UK 포함, FK는 03에서 별도 추가)
-- =========================================================

-- 생성 순서 주의: FK는 나중에 걸 예정이라 일단 테이블만 만든다.

DROP TABLE IF EXISTS t_lotto_recommend_result;
DROP TABLE IF EXISTS t_lotto_recommend_number;
DROP TABLE IF EXISTS t_lotto_recommend_run;

DROP TABLE IF EXISTS t_lotto_purchase_result;
DROP TABLE IF EXISTS t_lotto_purchase_number;
DROP TABLE IF EXISTS t_lotto_purchase;

DROP TABLE IF EXISTS t_lotto_draw_number;
DROP TABLE IF EXISTS t_lotto_draw;

-- ================================
-- 동행복권 회차 테이블
-- ================================
CREATE TABLE t_lotto_draw (
    drw_no       INT       NOT NULL COMMENT '당첨회차(회차번호)',
    drw_date     DATE      NOT NULL COMMENT '추첨일',
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성일시',
    PRIMARY KEY (drw_no)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT ='동행복권 회차 테이블';

-- ================================
-- 동행복권 회차별 상세 번호 테이블
-- pos: 1~6 기본번호, 7=보너스번호
-- ================================
CREATE TABLE t_lotto_draw_number (
    drw_no       INT              NOT NULL COMMENT '당첨회차(PK, FK)',
    pos          TINYINT UNSIGNED NOT NULL COMMENT '당첨번호 위치(1~6 기본, 7=보너스)',
    number       TINYINT UNSIGNED NOT NULL COMMENT '당첨번호(1~45)',
    created_date TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성일시',
    PRIMARY KEY (drw_no, pos),
    UNIQUE KEY ux_draw_no_number (drw_no, number)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT ='동행복권 회차별 상세 번호 테이블';

-- ================================
-- 로또 구매(가상) 메타 테이블
-- 1 purchase_id = 1게임(번호 6개)
-- target_drw_no: 목표 회차 (t_lotto_draw에 예정회차도 미리 insert 하는 운영 전제)
-- ================================
CREATE TABLE t_lotto_purchase (
    purchase_id   CHAR(36)    NOT NULL COMMENT '구매 ID(UUID) - 1게임',
    target_drw_no INT         NOT NULL COMMENT '목표 회차(이 회차 추첨을 노리고 구매)',
    purchase_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '구매 시각(가상)',
    source_type   VARCHAR(20) NOT NULL COMMENT '구매 출처(MANUAL/RANDOM/RECOMMEND)',
    created_date  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성일시',
    PRIMARY KEY (purchase_id),
    KEY ix_purchase_target_drw_no (target_drw_no),
    KEY ix_purchase_purchase_at (purchase_at)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT ='로또 구매(가상) 메타 테이블(1게임 단위, 목표 회차 포함)';

-- ==========================================
-- 로또 구매번호 상세 테이블
-- 1 purchase_id 당 6개 번호
-- pos: 1~6 (보너스 번호 없음)
-- ==========================================
CREATE TABLE t_lotto_purchase_number (
    purchase_id  CHAR(36)         NOT NULL COMMENT '구매 ID(PK, FK)',
    pos          TINYINT UNSIGNED NOT NULL COMMENT '번호 위치(1~6)',
    number       TINYINT UNSIGNED NOT NULL COMMENT '로또 번호(1~45)',
    created_date TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성일시',
    PRIMARY KEY (purchase_id, pos),
    UNIQUE KEY ux_purchase_number (purchase_id, number)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT ='로또 구매번호 상세 테이블(6개 번호)';

-- ==========================================
-- 로또 구매결과(당첨 평가 결과) 테이블
-- 1 purchase_id 당 1건 결과 저장(토이 기준)
-- drw_no는 평가한 당첨회차 (보통 target_drw_no와 동일)
-- ==========================================
CREATE TABLE t_lotto_purchase_result (
    purchase_id  CHAR(36)         NOT NULL COMMENT '구매 ID(PK, FK)',
    drw_no       INT              NOT NULL COMMENT '평가한 당첨회차(FK)',
    match_count  TINYINT UNSIGNED NOT NULL COMMENT '기본번호 일치 개수(0~6)',
    bonus_match  TINYINT(1)       NOT NULL DEFAULT 0 COMMENT '보너스 일치 여부(0/1)',
    result_rank  TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '등수(1~5), 낙첨은 0',
    created_date TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '구매 결과 평가 및 데이터 생성 시각',
    PRIMARY KEY (purchase_id),
    KEY ix_purchase_result_drw_no (drw_no)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT ='로또 구매 당첨 평가 결과 테이블';

-- ==========================================
-- 로또 추천 요청/실행 이력 테이블
-- 1 recommend_id = 추천 실행 1건
-- 추천 개수(count)는 params_json에 포함
-- 시간 컬럼은 created_date로 통일
-- ==========================================
CREATE TABLE t_lotto_recommend_run (
    recommend_id  CHAR(36)    NOT NULL COMMENT '추천 실행 ID(UUID)',
    target_drw_no INT         NOT NULL COMMENT '목표 회차(이 회차 추첨을 노리고 추천)',
    algorithm     VARCHAR(50) NOT NULL COMMENT '추천 알고리즘명(random, exclude_recent, freq_weighted 등)',
    params_json   JSON        NULL COMMENT '추천 파라미터(JSON, count 포함)',
    created_date  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '추천 요청 및 데이터 생성 시각',
    PRIMARY KEY (recommend_id),
    KEY ix_recommend_run_target_drw_no (target_drw_no),
    KEY ix_recommend_run_created_date (created_date)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT ='로또 추천 요청/실행 이력 테이블';

-- ==========================================
-- 로또 추천 번호 상세 테이블
-- 1 recommend_id 당 N세트 추천 가능
-- set_no: 추천 번호 세트 순번
-- pos: 1~6 (번호 위치)
-- ==========================================
CREATE TABLE t_lotto_recommend_number (
    recommend_id CHAR(36)         NOT NULL COMMENT '추천 실행 ID(PK, FK)',
    set_no       TINYINT UNSIGNED NOT NULL COMMENT '추천 번호 세트 순번(1부터 시작)',
    pos          TINYINT UNSIGNED NOT NULL COMMENT '번호 위치(1~6)',
    number       TINYINT UNSIGNED NOT NULL COMMENT '로또 번호(1~45)',
    created_date TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성 시각',
    PRIMARY KEY (recommend_id, set_no, pos),
    UNIQUE KEY ux_recommend_number (recommend_id, set_no, number)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT ='로또 추천 번호 상세 테이블(추천 결과)';

-- ==========================================
-- 로또 추천 결과(당첨 평가 결과) 테이블
-- recommend_id 1건에서 set_no(1..N)별로 결과 1건씩 저장
-- ==========================================
CREATE TABLE t_lotto_recommend_result (
    recommend_id CHAR(36)         NOT NULL COMMENT '추천 실행 ID(PK, FK)',
    set_no       TINYINT UNSIGNED NOT NULL COMMENT '추천 번호 세트 순번(1부터 시작)',
    drw_no       INT              NOT NULL COMMENT '평가한 당첨회차(FK)',
    match_count  TINYINT UNSIGNED NOT NULL COMMENT '기본번호 일치 개수(0~6)',
    bonus_match  TINYINT(1)       NOT NULL DEFAULT 0 COMMENT '보너스 일치 여부(0/1)',
    result_rank  TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '등수(1~5), 낙첨은 0',
    created_date TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성 시각(평가 시각)',
    PRIMARY KEY (recommend_id, set_no),
    KEY ix_recommend_result_drw_no (drw_no)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
    COMMENT ='로또 추천 번호 당첨 평가 결과 테이블(세트별)';
