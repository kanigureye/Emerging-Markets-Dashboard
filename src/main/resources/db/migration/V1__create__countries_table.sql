CREATE TABLE countries (
                           id BIGSERIAL PRIMARY KEY,
                           code VARCHAR(10) UNIQUE NOT NULL,
                           name VARCHAR(100) NOT NULL,
                           region VARCHAR(100)
);