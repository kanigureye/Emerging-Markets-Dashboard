CREATE TABLE indicators (
                            id            BIGSERIAL PRIMARY KEY,
                            country_id    BIGINT        NOT NULL REFERENCES countries(id),
                            indicator_code VARCHAR(50)  NOT NULL,
                            indicator_name VARCHAR(255) NOT NULL,
                            year          INTEGER       NOT NULL,
                            value         NUMERIC(20, 4),
                            created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
                            CONSTRAINT uq_indicator UNIQUE (country_id, indicator_code, year)
);

CREATE INDEX idx_indicators_country_id ON indicators(country_id);
CREATE INDEX idx_indicators_code       ON indicators(indicator_code);
CREATE INDEX idx_indicators_year       ON indicators(year);