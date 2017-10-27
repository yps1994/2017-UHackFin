"""
DataFetcher is a simple wrapper to get the data in pandas dataframe
"""
import pandas
import sqlalchemy
import sqlalchemy.engine.url

class DataFetcher():
    """
    Data Fetcher
    """
    def __init__(self):
        self.engine = None

    def connect(self, *args, **kwags):
        """
        Connecting to database
        """
        url = self._creat_url(*args, **kwags)
        self.engine = sqlalchemy.create_engine(url)

    def get_df(self, start_time, end_time, ids=None):
        """
        Get dataframe from the database
        """
        # We create the query directly for easy understanding
        if ids is not None:
            assert isinstance(ids, list), "input ids must be a list"
            query = "SELECT * FROM stocks_raw WHERE id IN ({}) AND date BETWEEN %s AND %s".format(
                ','.join(['%s']*len(ids)))
            return pandas.read_sql_query(query, self.engine, params=(*ids, start_time, end_time))
        else:
            query = "SELECT * FROM stocks_raw WHERE date BETWEEN %s AND %s"
            return pandas.read_sql_query(query, self.engine, params=(start_time, end_time))

    @staticmethod 
    def _creat_url(host, user, password, database, port):
        return sqlalchemy.engine.url.URL("mysql+mysqlconnector", user, password, host, port, database)
