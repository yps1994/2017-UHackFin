CREATE TABLE history (
    id VARCHAR(20),
    date DATE,
    high FLOAT,
    low FLOAT,
    open FLOAT,
    close FLOAT,
    PRIMARY KEY (id, date)
);

CREATE TABLE detail (
    stockcode VARCHAR(20),
    name_eng VARCHAR(256),
    name_chi VARCHAR(256),
    board_lot INT,
    PRIMARY KEY (stockcode)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE accounts (
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(256),
    passwd CHAR(64),
    PRIMARY KEY (id),
    UNIQUE (email)
);

LOAD DATA INFILE '/var/lib/mysql-files/stocks_list_HK.csv'
    INTO TABLE detail
    FIELDS TERMINATED BY ','
    IGNORE 1 LINES;
