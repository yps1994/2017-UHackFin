#!/bin/bash
set -e

# SQL settings
export MYSQL_DATABASE=${MYSQL_DATABASE:-"stock"}
export MYSQL_USER=${MYSQL_USER:-""}
export MYSQL_PASSWORD=${MYSQL_PASSWORD:-""}
export MYSQL_PORT=${MYSQL_PORT:-3306}
export MYSQL_HOST=${MYSQL_HOST:-"127.0.0.1"}

# ==================================== 
# DO NOT MODIFY ANYTHING BELOW
# ==================================== 

# script directory
rootdir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# container name
container_db=sqldb

if ! [ -x "$(which docker)" ]; then
    echo "Docker is not installed. Aborted. "
    exit 1
fi

if ! [ -x "$(which node)" ]; then
    echo "Node is not installed. Aborted. "
    exit 1
fi

# Set up the database and start the server
echo "Setting up database and table";
docker container inspect ${container_db} > /dev/null 2>&1 || docker create --name ${container_db} -p ${MYSQL_PORT}:3306  \
 --mount type=bind,src="${rootdir}/database/scripts/",dst="/docker-entrypoint-initdb.d/"    \
 --mount type=bind,src="${rootdir}/database/config/my.cnf",dst="/etc/my.cnf"                \
 -e MYSQL_DATABASE=${MYSQL_DATABASE}    \
 -e MYSQL_USER=${MYSQL_USER}            \
 -e MYSQL_PASSWORD=${MYSQL_PASSWORD}    \
 mysql/mysql-server:latest > /dev/null

docker cp ${rootdir}/database/csv/*.csv ${container_db}:/var/lib/mysql-files/

echo "Starting MySQL service";
docker start ${container_db} > /dev/null


# ==================================== 
# Setting up the cronjob
# ==================================== 
echo "Install essential packages for cron jobs";
cd ${rootdir}/cron/ && npm install

echo "Creating new cron job";
crontab -l > cron.old
if grep -Fq "fetch_yahoo_data.js" cron.old; then
    echo "Found cronjob, skip."
else
    cp cron.old cron.new
    echo "0 8 * * * node ${rootdir}/cron/fetch_yahoo_data.js >> ${rootdir}/cron/fetch.log 2>&1" >> cron.new && crontab cron.new
fi
echo "Done!"
