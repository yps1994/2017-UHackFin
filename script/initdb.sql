CREATE TABLE stocks_raw (
    id VARCHAR(20),
    date DATE,
    high FLOAT,
    low FLOAT,
    open FLOAT,
    close FLOAT,
    PRIMARY KEY (id, date)
);

