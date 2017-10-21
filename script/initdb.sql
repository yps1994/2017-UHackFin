CREATE TABLE stocks_raw (
    id VARCHAR(20),
    date DATE,
    max FLOAT,
    min FLOAT,
    open FLOAT,
    close FLOAT,
    PRIMARY KEY (id, date)
);

