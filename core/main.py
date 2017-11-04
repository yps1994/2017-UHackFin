import flask
import flask_restful

import utils.predict
from routes import index, stat


app = flask.Flask(__name__)

api = flask_restful.Api(app, catch_all_404s=True)
api.add_resource(index.Index, '/')
api.add_resource(stat.StatAPI, '/stat/<string:symbol>')
if __name__ == '__main__':
    app.run()
