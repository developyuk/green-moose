#!/bin/sh
VERSION="2.1.1"
FILE="phantomjs"

if [ ! -f "./parser/$FILE" ] ;then
  curl -Lk -o "./parser/$FILE" "https://github.com/fg2it/phantomjs-on-raspberry/raw/master/rpi-2-3/wheezy-jessie/v$VERSION/phantomjs"
fi

docker-compose -f docker-compose-arm.yaml build
