#!/bin/sh
VERSION="2.1.1"
FOLDER="phantomjs-$VERSION-linux-x86_64"
FILE="$FOLDER.tar.bz2"

if [ ! -f "./backend/$FILE" ] ;then
  curl -Lk -o "./backend/$FILE" "https://bitbucket.org/ariya/phantomjs/downloads/$FILE"
fi

if [ ! -f "./backend/phantomjs" ]; then
  tar xvjf "./backend/$FILE" -C "./backend"
  mv "./backend/$FOLDER/bin/phantomjs" "./backend/phantomjs"
  rm -r "./backend/$FOLDER"
fi

docker-compose build
