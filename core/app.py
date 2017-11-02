import flask
import flask_restful

import utils.predict
from routes import index, risk_api

app = flask.Flask(__name__)
predictor = utils.predict.Predictor(app, "data/null.pkl")

api = flask_restful.Api(app, catch_all_404s=True)
api.add_resource(index.Index, '/')
api.add_resource(risk_api.RiskAPI, '/risk',
                 resource_class_kwargs={'predictor': predictor})
if __name__ == '__main__':
    app.run()
