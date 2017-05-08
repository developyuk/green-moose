#!/bin/sh
docker exec -it $(docker ps | grep greenmoose_backend | awk '{print $1}') bash
