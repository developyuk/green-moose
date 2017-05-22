#!/bin/sh
VERSION="2.1.1"
FOLDER="phantomjs-$VERSION-linux-x86_64"
FILE="$FOLDER.tar.bz2"

if [ ! -f "./parser/$FILE" ] ;then
  curl -Lk -o "./parser/$FILE" "https://bitbucket.org/ariya/phantomjs/downloads/$FILE"
fi

if [ ! -f "./parser/phantomjs" ]; then
  tar xvjf "./parser/$FILE" -C "./parser"
  mv "./parser/$FOLDER/bin/phantomjs" "./parser/phantomjs"
  rm -r "./parser/$FOLDER"
fi

docker-compose build
