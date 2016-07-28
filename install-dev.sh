#!/bin/bash

if [ $# == 0 ]; then
	echo "Usage: ./install-dev.sh <package> [packages ...]";
	return 0;
fi

npm install $* --save-dev && tsd install $* -r -s
