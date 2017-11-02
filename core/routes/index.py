import flask_restful

class Index(flask_restful.Resource):
    def get(self):
        return {'status': 'OK'}
