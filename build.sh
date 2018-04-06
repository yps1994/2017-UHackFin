#!/bin/bash
set -e

# SQL settings
export MYSQL_DATABASE=stock
export MYSQL_USER=backend
export MYSQL_PASSWORD=backend#1
export MYSQL_PORT=3306
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
docker create --name ${container_db} -p ${MYSQL_PORT}:3306  \
 --mount type=bind,src="$(pwd)/database/scripts/",dst="/docker-entrypoint-initdb.d/"    \
 -e MYSQL_DATABASE=${MYSQL_DATABASE}    \
 -e MYSQL_USER=${MYSQL_USER}            \
 -e MYSQL_PASSWORD=${MYSQL_PASSWORD}    \
 mysql/mysql-server:latest

echo "Starting MySQL service";
docker cp $(pwd)/database/csv/*.csv ${container_db}:/var/lib/mysql-files/
docker start ${container_db}

# ==================================== 
# Setting up
# ==================================== 

# ==================================== 
# Setting up the backend server
# ==================================== 
echo "Setting up backend...";
if ! [ -x "$(which node)" ]; then
    echo "Node is not installed. Aborted. "
    exit 1
fi
