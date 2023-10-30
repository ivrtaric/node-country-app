DROP TABLE IF EXISTS neighbours;
DROP TABLE IF EXISTS country;

CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL,
    code_alpha_2 VARCHAR(2) NOT NULL,
    code_alpha_3 VARCHAR(3) NOT NULL,
    flag VARCHAR(255)
);

CREATE TABLE neighbours (
    id SERIAL PRIMARY KEY,
    country_id INT NOT NULL,
    neighbour_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES country(id),
    FOREIGN KEY (neighbour_id) REFERENCES country(id),
    CONSTRAINT unq_pair UNIQUE (country_id, neighbour_id)
);

CREATE TEMP TABLE temp_neighbours (country_code VARCHAR(20), country_name VARCHAR(255), neighbour_code VARCHAR(20), neighbour_name VARCHAR(255));

\! pwd
COPY country(name, code, code_alpha_2, code_alpha_3, flag) FROM '/fixtures/countries.csv' DELIMITER ',' CSV HEADER;
COPY temp_neighbours(country_code, country_name, neighbour_code, neighbour_name) FROM '/fixtures/country_neighbours.csv' DELIMITER ',' CSV HEADER;

INSERT INTO neighbours (country_id, neighbour_id)
SELECT c.id AS country_id, n.id AS neighbour_id
FROM temp_neighbours tn
    JOIN country c ON tn.country_code = c.code
    JOIN country n ON tn.neighbour_code = n.code;

DROP TABLE temp_neighbours;
