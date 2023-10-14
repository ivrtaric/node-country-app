TRUNCATE TABLE country CASCADE;
TRUNCATE TABLE neighbours CASCADE;

INSERT INTO country (id, "name", code, code_alpha_2, code_alpha_3, flag)
VALUES
    (1, 'United States', 'USA', 'US', 'USA', 'us_flag.png'),
    (2, 'Canada', 'CAN', 'CA', 'CAN', 'canada_flag.png'),
    (3, 'United Kingdom', 'UK', 'UK', 'UK', 'uk_flag.png'),
    (4, 'France', 'FRA', 'FR', 'FRA', 'france_flag.png'),
    (5, 'Germany', 'GER', 'DE', 'DEU', 'germany_flag.png'),
    (6, 'Spain', 'SPA', 'ES', 'ESP', 'spain_flag.png'),
    (7, 'Mexico', 'MEX', 'MX', 'MEX', 'mexico_flag.png')
ON CONFLICT DO NOTHING;

ALTER SEQUENCE country_id_seq RESTART WITH 8;

INSERT INTO neighbours (country_id, neighbour_id)
SELECT c.id, n.id
FROM country c, country n
WHERE (c."name" = 'France' AND n."name" IN ('Germany', 'Spain'))
   OR (c."name" = 'Canada' AND n."name" IN ('United States'))
   OR (c."name" = 'United States' AND n."name" IN ('Canada', 'Mexico'))
ON CONFLICT DO NOTHING;
