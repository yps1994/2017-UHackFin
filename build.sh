#!/bin/bash
set -e

# SQL settings
export MYSQL_DATABASE=
export MYSQL_USER=
export MYSQL_PASSWORD=
export MYSQL_PORT=
export MYSQL_HOST=  # Bind with your local ip or virtualbox image ip, depends on your setting

# ==================================== 
# DO NOT MODIFY ANYTHING BELOW
# ==================================== 
if ! [ -x "$(which docker)" ]; then
    echo "Docker is not installed. Aborted. "
    exit 1
fi

# Set up the database and wait for some seconds until the container is started
echo "Setting up database...";
docker run --name sqldb -p ${MYSQL_PORT}:3306  \
 -e MYSQL_RANDOM_ROOT_PASSWORD=yes             \
 -e MYSQL_DATABASE=${MYSQL_DATABASE}           \
 -e MYSQL_USER=${MYSQL_USER}                   \
 -e MYSQL_PASSWORD=${MYSQL_PASSWORD}           \
 -d mysql && sleep 20

# Set up the table
echo "Setting up table...";
docker run --rm --name setupdb --link sqldb:mysql \
 -v "$PWD/script":/script mysql sh -c             \
 "mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} -D ${MYSQL_DATABASE} -h ${MYSQL_HOST} < /script/initdb.sql"

# ==================================== 
# Setting up the backend server
# ==================================== 
# We use local Nodejs for development, will be moved to Docker/nodejs for deployment (if really necessary)

if ! [ -x "$(which node)" ]; then
    echo "Node is not installed. Aborted. "
    exit 1
fi

if ! [ -x "$(which npm)" ]; then
    echo "npm is not installed. Aborted. "
    exit 1
fi

cd ./backend && npm install && cd ../