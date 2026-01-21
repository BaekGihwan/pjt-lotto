-- =========================================================
-- 03_constraints.sql
-- 목적: FK 제약조건 생성
-- =========================================================

-- draw_number -> draw
ALTER TABLE t_lotto_draw_number
    ADD CONSTRAINT fk_draw_number_draw
        FOREIGN KEY (drw_no) REFERENCES t_lotto_draw (drw_no)
            ON DELETE CASCADE
            ON UPDATE CASCADE;

-- purchase -> draw (목표 회차)
ALTER TABLE t_lotto_purchase
    ADD CONSTRAINT fk_purchase_target_draw
        FOREIGN KEY (target_drw_no) REFERENCES t_lotto_draw (drw_no)
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

-- purchase_number -> purchase
ALTER TABLE t_lotto_purchase_number
    ADD CONSTRAINT fk_purchase_number_purchase
        FOREIGN KEY (purchase_id) REFERENCES t_lotto_purchase (purchase_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;

-- purchase_result -> purchase
ALTER TABLE t_lotto_purchase_result
    ADD CONSTRAINT fk_purchase_result_purchase
        FOREIGN KEY (purchase_id) REFERENCES t_lotto_purchase (purchase_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;

-- purchase_result -> draw
ALTER TABLE t_lotto_purchase_result
    ADD CONSTRAINT fk_purchase_result_draw
        FOREIGN KEY (drw_no) REFERENCES t_lotto_draw (drw_no)
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

-- recommend_run -> draw (목표 회차)
ALTER TABLE t_lotto_recommend_run
    ADD CONSTRAINT fk_recommend_run_target_draw
        FOREIGN KEY (target_drw_no) REFERENCES t_lotto_draw (drw_no)
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

-- recommend_number -> recommend_run
ALTER TABLE t_lotto_recommend_number
    ADD CONSTRAINT fk_recommend_number_run
        FOREIGN KEY (recommend_id) REFERENCES t_lotto_recommend_run (recommend_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;

-- recommend_result -> recommend_run
ALTER TABLE t_lotto_recommend_result
    ADD CONSTRAINT fk_recommend_result_run
        FOREIGN KEY (recommend_id) REFERENCES t_lotto_recommend_run (recommend_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;

-- recommend_result -> draw
ALTER TABLE t_lotto_recommend_result
    ADD CONSTRAINT fk_recommend_result_draw
        FOREIGN KEY (drw_no) REFERENCES t_lotto_draw (drw_no)
            ON DELETE RESTRICT
            ON UPDATE CASCADE;
