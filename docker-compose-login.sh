#!/bin/sh
docker exec -it $(docker ps | grep greenmoose_frontend | awk '{print $1}') bash
