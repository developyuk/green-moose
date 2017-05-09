#!/bin/sh
docker exec -it $(docker ps | grep greenmoose_frontenddev | awk '{print $1}') bash
