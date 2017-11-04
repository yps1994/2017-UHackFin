import json
import urllib.request
import os
import flask
import flask_restful
import sys
import logging
import tools.sql
import numpy as np
import matplotlib.pyplot as plt
import pandas

MYSQL_DATABASE = 
MYSQL_USER = 
MYSQL_PASSWORD =
MYSQL_PORT =
MYSQL_HOST =

def max_drawdown(X):
    mdd = 0
    peak = X[0]
    for x in X:
        if x > peak: 
            peak = x
        dd = (peak - x) / peak
        if dd > mdd:
            mdd = dd
    return mdd    

class StatAPI(flask_restful.Resource):
    def __init__(self):
        self.fetcher = tools.sql.DataFetcher()
        self.fetcher.connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT)
        self.start_date = '2016-10-01'
        self.end_date = '2017-10-10'
        
    def get(self, symbol):
        data = self._get_data(symbol)
        stat = self._analyze(data, symbol)
        return {'status': 'OK', 'id': symbol, 'stat': stat}

    def _get_data(self, symbol):
        # hard code
        # start_date = "2016-10-01"
        # end_date = "2017-10-10"
        return self.fetcher.get_df(self.start_date, self.end_date, ids=[symbol])
    
    def _analyze(self, data, symbol):
        #TODO: stat analysis
        stock_prices = np.array(data['open'])
        ref = self.fetcher.get_df(self.start_date, self.end_date, ids=['^HSI'])
        ref = np.array(ref['open'])
        length = min(len(ref), len(stock_prices))
        ref = ref[range(length)]
        stk = stock_prices[range(length)]
        
        variance = np.var(stk)                          # variance
        max_dd = abs(max_drawdown(stk) * 100)           # max drawdown(%)
        beta = np.cov(stk, ref)[0][1] / np.var(ref)     # beta
        
        query = 'select * from rank_user where Rank<=100'
        temp = pandas.read_sql_query(query, self.fetcher.engine)
        temp = np.array(temp)
        
        mean_ratio = 0
        stk_num = 0
        for rank in range(len(temp)):
            for index in range(1, 6):
                if temp[rank][index] == symbol:
                    stk_num += 1
                    mean_ratio += temp[rank][index+5]
        mean_ratio = mean_ratio / stk_num * 100         # (%)
        average_per = stk_num / len(temp) * 100         # (%)
        
        
        
        # logging.error(data)
        return 'max drawdown:', max_dd, 'beta:', beta, 'variance:', variance, 'average_per:', average_per, 'mean_ratio:', mean_ratio