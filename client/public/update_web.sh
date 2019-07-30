#!/bin/bash
docker rm $(docker stop $(docker ps -a -q --filter ancestor='html-server-image:v1' --format="{{.ID}}"))
docker build -t html-server-image:v1 .
docker run --name web_client -d -p 8081:80 html-server-image:v1
