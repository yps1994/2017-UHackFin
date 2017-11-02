"""
Predictor of the time series
"""
import pickle

class Predictor():
    """
    General purpose prediction
    """
    def __init__(self, app=None, src=""):
        """
        Read the model from local
        Args:
            src (str): model storing position
        """
        with open(src, 'rb') as f:
            self.model = pickle.load(f)
        print("Predictor Model is loaded successfully")

        if app is not None:
            self.init_app(app)

    def predict(self, arr):
        """
        Predict the time series and classify it into several categories
        Args:
            arr (list): time series
        Return:
            group (int): group id
            groups (dict): {id, probablity}
        """
        return self.model.predict(arr).tolist()
        
    def init_app(self, app):
        if 'predictor' not in app.extensions:
            app.extensions['predictor'] = {}
