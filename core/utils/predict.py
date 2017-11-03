"""
Predictor of the time series
"""
import sys
import pickle
import logging

class Predictor():
    """
    General purpose prediction
    """
    def __init__(self, app=None, src=""):
        self.logger = logging.getLogger(__name__)
        self.logger.addHandler(logging.StreamHandler(sys.stdout))
        self.logger.setLevel(logging.DEBUG)
        
        """
        Read the model from local
        Args:
            src (str): model storing position
        """
        with open(src, 'rb') as f:
            self.model = pickle.load(f)
        self.logger.info("Predictor Model is loaded successfully")

        if app is not None:
            self.init_app(app)

    def predict(self, inputv):
        """
        Predict the time series and classify it into several categories
        Args:
            inputv (list, dict): time series
        Return:
            group (int): group id
            groups (dict): {id, probablity}
        """
        if isinstance(inputv, dict):
            arr = list(inputv.values())
            names = list(inputv.keys())
        try:
            result = self.model.predict(arr).tolist()
        except Exception as e:
            result = [None] * len(arr)
            self.logger.error(e)

        if isinstance(inputv, dict):
            result = dict(zip(names, result))
        return result
        
    def init_app(self, app):
        if 'predictor' not in app.extensions:
            app.extensions['predictor'] = {}
