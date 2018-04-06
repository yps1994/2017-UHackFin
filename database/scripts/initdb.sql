CREATE TABLE daily (
    id VARCHAR(20),
    date DATE,
    high FLOAT,
    low FLOAT,
    open FLOAT,
    close FLOAT,
    PRIMARY KEY (id, date)
);

CREATE TABLE detail (
    STOCKCODE VARCHAR(20),
    NAME_ENG VARCHAR(256),
    NAME_CHI VARCHAR(256),
    BOARD_LOT INT,
    PRIMARY KEY (STOCKCODE)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

LOAD DATA INFILE '/var/lib/mysql-files/stocks_list_HK.csv'
    INTO TABLE detail
    FIELDS TERMINATED BY ','
    IGNORE 1 LINES;
