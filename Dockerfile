FROM tiangolo/uwsgi-nginx-flask:python3.6
COPY ./core /app
ENV BACKEND_URL http://127.0.0.1:3000
RUN pip install -r requirements.txt
