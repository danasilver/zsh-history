#!/bin/zsh --login

now=`date +%s`
file="/tmp/zsh-history-${now}.tmp"

# Some good zsh history options to try
# and get as much history as possible.
# The default is 30 lines.
export HISTFILE=$1
export HISTSIZE=100000
export SAVEHIST=100000

# Read history from $HISTFILE.
fc -R

# Use fc to read and format the history
# since it's otherwise hard to parse.
# See: https://github.com/johan/zsh/blob/master/Src/hist.c#L2192-L2220
fc -lDt '%s' 1 > $file

echo $file

exit 0
