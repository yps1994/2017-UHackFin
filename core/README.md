# Core development

- To access the data from database,
    1. A Python 3 distribution needs to be installed, i.e. [Anaconda](https://www.anaconda.com/downloads)
    2. Several packages must be installed, if you are using **Anaconda**, run
        ```bash
        conda install --yes --file requirements.txt
        ```

        or if you are using **pip**, run
        ```bash
        pip install -r requirements.txt
        ```

    3. Users may need to fill in the constant variables in `demo.py`
    4. Execute the script by `python3 demo.py`

- To predict data, a `POST` method will be need. 
    ```
    curl -H "Content-Type: application/json" -X POST -d '[{"stock":"0002.HK","share": 1000}, {"stock": "0001.HK", "share": 2000}]' http://localhost:5000/risk
    ```
