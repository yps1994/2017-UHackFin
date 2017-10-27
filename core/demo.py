#!/usr/bin/env python3

"""
This script demo how to use the data fetcher to get the data into database
"""
import datetime
import tools.sql

# We need to fill in the following variables first
MYSQL_DATABASE =
MYSQL_USER =
MYSQL_PASSWORD =
MYSQL_PORT =
MYSQL_HOST =


def main():
    # support we need to find the data bewtween "2016-10-01" and "2017-10-10",
    # with stocks id = 0001.HK and 0002.HK
    start_date = "2016-10-01"
    end_date = "2017-10-10"
    targets = ["0001.HK", "0002.HK"]

    # create the fetcher and connect to database
    fetcher = tools.sql.DataFetcher()
    fetcher.connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT)

    # get the data in dataframe format and store it as `db`
    df = fetcher.get_df(start_date, end_date, ids=targets)

    # Following are some examples to work with dataframe
    # A quick tutorial: https://pandas.pydata.org/pandas-docs/stable/10min.html
    
    # print the dataframe
    print("Example 1\n", df)

    # select part of dataframe
    u = df['open']
    print("Example 2\n", u)

    # select part of dataframe with some constraint
    v = df[df['date']==datetime.date(2016, 10, 3)]
    print("Example 3\n", v)

    # convert dataframe column to list
    l1 = v['high'].tolist()
    print("Example 4\n", l1)

if __name__ == '__main__':
    main()
