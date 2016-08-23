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

if [ $? -ne 0 ]; then
  exit 1
fi

# Use fc to read and format the history
# since it's otherwise hard to parse.
# See: https://github.com/johan/zsh/blob/master/Src/hist.c#L2192-L2220
history_contents=`fc -lDt '%s' 1`

if [ $? -ne 0 ]; then
  exit 1
else
  # Only create the file if the `fc' exited successfully, otherwise
  # we won't be able to delete it later.
  echo $history_contents > $file
fi

echo $file
exit 0
