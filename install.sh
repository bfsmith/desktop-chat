#!/bin/bash

if [ $# == 0 ]; then
	echo "Usage: ./install.sh <package> [packages ...]";
	return 0;
fi

npm install $* --save && tsd install $* -r -s
