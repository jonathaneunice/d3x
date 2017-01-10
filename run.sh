#!/bin/bash

# Simple runner for a web app. Chooses a
# port, starts a simple HTTP server on that
# port, then opens a browser there. The
# browser open is Mac OS X speciic. This is
# primarily for developers, as our live apps
# will all be cloud-housed.

DEFAULTFILE=index.html

# choose a port number based on the
# pid of the shell process - range 5000-9998
let PORT=`expr $PPID '%' 4999 + 5000`

FILE=$1
if [ -z "$FILE" ]
then
    FILE=$DEFAULTFILE
fi

# kill prev process if still running
killport $PORT
sleep 2
python -m SimpleHTTPServer $PORT 2>.log &
sleep 2
echo "opening" $FILE
open http://localhost:$PORT/$FILE
