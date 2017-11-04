import json
import urllib.request
import os
import flask
import flask_restful

import tools.sql

MYSQL_DATABASE =
MYSQL_USER =
MYSQL_PASSWORD =
MYSQL_PORT =
MYSQL_HOST =

class StatAPI(flask_restful.Resource):
    def __init__(self):
        self.fetcher = tools.sql.DataFetcher()
        self.fetcher.connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT)

    def get(self, symbol):
        data = self._get_data(symbol)
        print(data)
        stat = self._analyze(data)
        return {'status': 'OK', 'id': symbol, 'stat': stat}

    def _get_data(self, symbol):
        # hard code
        start_date = "2016-10-01"
        end_date = "2017-10-10"
        return self.fetcher.get_df(start_date, end_date, ids=[symbol])
    
    def _analyze(self, data):
        #TODO: stat analysis
        return {'mean': 0, 'max': 100, 'min': 0, 'std': 20}