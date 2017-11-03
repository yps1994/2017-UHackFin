import json
import urllib.request
import os
import flask
import flask_restful

import utils.predict

DB_URL = os.environ.get('BACKEND_URL', "http://127.0.0.1:3000") 

class RiskAPI(flask_restful.Resource):
    def __init__(self, **kwags):
        self.predictor = kwags['predictor']

    def get(self):
        return {'status': 'OK'}

    def post(self):
        request = flask.request.get_json()
        result = self._analyze(request)
        return {'status': result}

    def _analyze(self, request):
        assert isinstance(request, list)
        symbols = [record.get('symbol') for record in request]
        series = self._get_series(symbols)    
        return self.predictor.predict(series)


    def _share_to_percent(self, records):
        #TODO: Convert number of shares to percentage
        for record in records:
            record['percent'] = 1
        return records

    def _get_series(self, symbols):
        open_series = {}
        for symbol in symbols:
            url = "{}/stocks/raw/{}".format(DB_URL, symbol)
            val = json.loads(urllib.request.urlopen(url).read(), encoding='utf-8')
            series = list(reversed([d['open'] for d in val.get('data')]))
            open_series[symbol] = series
        return open_series
