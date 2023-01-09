#!/bin/bash

envFile=".env";

cd $(dirname $0)

if [ -n "${1:-}" ]; then
    envFile=$1
fi

if [ ! -f $envFile ]
then
    echo "Please create your .env file starting from .env.example"
    exit 1
fi

set -o allexport
source $envFile
set +o allexport

npm install
node app.js