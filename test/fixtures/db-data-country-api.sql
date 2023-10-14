TRUNCATE TABLE country CASCADE;
TRUNCATE TABLE neighbours CASCADE;

INSERT INTO country (id, "name", code, code_alpha_2, code_alpha_3, flag)
VALUES
    (1, 'United States', 'USA', 'US', 'USA', 'us_flag.png'),
    (2, 'Canada', 'CAN', 'CA', 'CAN', 'canada_flag.png')
ON CONFLICT DO NOTHING;

ALTER SEQUENCE country_id_seq RESTART WITH 3;
