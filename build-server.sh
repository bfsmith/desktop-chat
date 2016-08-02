#!/bin/bash

if [ $# -lt 1 ]; then
	echo "Usage: build-server.sh <src>"
	exit
fi

SRC=$1
TEMP=tmp
rm -rf $TEMP
mkdir -p $TEMP
cp -R node_modules $TEMP/.
cp -R $SRC/server $SRC/shared $TEMP/.
mv $TEMP/server/start.sh $TEMP/start.sh
tar -czf server.tar.gz $TEMP/*
rm -rf $TEMP