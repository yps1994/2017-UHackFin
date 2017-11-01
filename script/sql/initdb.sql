CREATE TABLE stocks_raw (
    id VARCHAR(20),
    date DATE,
    high FLOAT,
    low FLOAT,
    open FLOAT,
    close FLOAT,
    PRIMARY KEY (id, date)
);

CREATE TABLE stocks_list (
    STOCKCODE VARCHAR(20),
    NAME_ENG VARCHAR(256),
    NAME_CHI VARCHAR(256),
    BOARD_LOT INT,
    PRIMARY KEY (STOCKCODE)
);
