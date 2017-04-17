#!/bin/sh

VERSION="2.1.1"
FOLDER="phantomjs-$VERSION-linux-x86_64"
FILE="$FOLDER.tar.bz2"

if [ ! -f "./$FILE" ]; then
	curl -Lk -o "./$FILE" "https://bitbucket.org/ariya/phantomjs/downloads/$FILE"
fi

if [ ! -f "./browser/phantomjs" ]; then
	tar xvjf "./$FILE"
  mv "./$FOLDER/bin/phantomjs" "./browser/phantomjs"
  rm -r "./$FILE" "./$FOLDER"
fi

docker-compose build
