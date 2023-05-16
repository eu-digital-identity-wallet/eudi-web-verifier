#!/bin/bash
if [ "$(docker ps -a -q -f name=verifier-app)" ]; then
    if [ "$(docker ps -aq -f status=running -f name=verifier-app) || $(docker ps -aq -f status=exited -f name=verifier-app)" ]; then
        # cleanup
        echo "clean conatiner..."
        docker rm verifier-app -f
        echo "clean verifier docker image..."
        docker rmi verifier-ui -f
    fi
fi

docker build --no-cache -t verifier-ui .
docker run --name verifier-app -d -it -p 4300:4300 -e HOST_API="http://localhost:4300" verifier-ui
