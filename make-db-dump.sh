#!/bin/bash

pathToFolder='./back-up'
maxFileCount=200

# make fodler if needed
if [ ! -d $pathToFolder ]
then
    mkdir $pathToFolder
fi

cd $pathToFolder

fileCount=$(set -- ./* ; echo $#)

mongodump --port=27001 --archive=db-dump-`date +%Y-%m-%d-%H-%M-%S`.zip

# remove extra files
if [ "$fileCount" -gt "$maxFileCount" ]; then
    echo "File count is $fileCount, gtratest then $maxFileCount, remove the oldest file."
    rm "$(ls -t | tail -1)"
fi
