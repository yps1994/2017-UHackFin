import flask
import flask_restful

import utils.predict

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
        records = self._share_to_percent(request)
        #TODO: Fetch the recent array
        series = [[-0.8, -1]]
        for record in records:
            record['risk'] = self.predictor.predict(series)
        return records

    def _share_to_percent(self, records):
        #TODO: Convert number of shares to percentage
        for record in records:
            record['percent'] = 1
        return records
