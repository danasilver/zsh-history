## zsh history

Read and parse your complete zsh history.

```js
require('zsh-history').history()
  .then(console.log);

[
  {
    time: Date('2016-08-20T20:09:24.000Z'),
    executionTime: 2,
    command: 'sleep',
    arguments: '2'
  },

  // many more commands
]
```

### Execution Time

See http://zsh.sourceforge.net/Doc/Release/Options.html#History.

To write execution time to history, the following zsh options must be set:

```zsh
unsetopt SHARE_HISTORY
unsetopt APPEND_HISTORY
unsetopt INC_APPEND_HISTORY

setopt EXTENDED_HISTORY
setopt INC_APPEND_HISTORY_TIME
```

oh-my-zsh's default is `SHARE_HISTORY` and `INC_APPEND_HISTORY`, which writes
history commands to the history file before executing and makes them available
to other sessions via the `history` command by reloading the history file
when `history` is run.

To achieve a similar effect with `SHARE_HISTORY` off, you may want to
`alias history="fc -R && fc -l 1"`, which will reload the history file when you
run `history`.

Retrieving a session's own history (ex. up arrow) will always work as expected.

Without `INC_APPEND_HISTORY_TIME` set, session history will contain execution
time, but the history file won't.
