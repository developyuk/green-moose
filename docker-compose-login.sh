#!/bin/sh
docker exec -it $(docker ps | grep micrometa | awk '{print $1}') bash
