#!/bin/bash

if [ $# -lt 2 ]; then
	echo "Usage: build-electron.sh <src> <out>"
	exit
fi

SRC=$1
OUT=$2
TEMP=tmp
rm -rf $TEMP
mkdir -p $TEMP/app
cp -R node_modules $TEMP/.
cp -R $SRC/public $SRC/shared $SRC/electron* $TEMP/app/.
cp package.json $TEMP/.
electron-packager $TEMP --platform=darwin --arch=x64 --out=$OUT --overwrite --asar
tar czf DesktopChat.app.tar.gz $OUT/DesktopChat-darwin-x64/DesktopChat.app
rm -rf $TEMP