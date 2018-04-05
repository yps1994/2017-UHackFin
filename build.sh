#!/bin/bash
set -e

# SQL settings
export MYSQL_DATABASE=
export MYSQL_USER=
export MYSQL_PASSWORD=
export MYSQL_PORT=
export MYSQL_HOST=

# ==================================== 
# DO NOT MODIFY ANYTHING BELOW
# ==================================== 

# container name
container_db=sqldb

if ! [ -x "$(which docker)" ]; then
    echo "Docker is not installed. Aborted. "
    exit 1
fi

# Set up the database
echo "Setting up database and table";
docker container inspect ${container_db} > /dev/null 2>&1 || docker run --name ${container_db} -p ${MYSQL_PORT}:3306  \
 --mount type=bind,src="$(pwd)/database/scripts/",dst="/docker-entrypoint-initdb.d/"    \
 -e MYSQL_DATABASE=${MYSQL_DATABASE}    \
 -e MYSQL_USER=${MYSQL_USER}            \
 -e MYSQL_PASSWORD=${MYSQL_PASSWORD}    \
 -d mysql/mysql-server:latest

# ==================================== 
# Setting up the backend server
# ==================================== 
echo "Setting up backend...";
if ! [ -x "$(which node)" ]; then
    echo "Node is not installed. Aborted. "
    exit 1
fi

if ! [ -x "$(which npm)" ]; then
    echo "npm is not installed. Aborted. "
    exit 1
fi

cd ./backend && npm install && cd ../

# ==================================== 
# Setting up the frontend server
# ==================================== 
echo "Setting up frontend...";
cd ./app && npm install && cd ../
