## zsh history

[![Build Status](https://travis-ci.org/danasilver/zsh-history.svg?branch=master)](https://travis-ci.org/danasilver/zsh-history)

Read and parse your complete zsh history.

```js
require('zsh-history')().then(console.log);

[
  {
    time: Date('2016-08-20T20:09:24.000Z'),
    executionTime: 2,
    command: 'sleep',
    arguments: [ '2' ]
  },

  // many more commands
]
```

### API

#### #history([histFile])

Parse a [zsh history](http://zsh.sourceforge.net/Guide/zshguide02.html#l16)
file, defaulting to `~/.zsh_history`. Pass a path to a different history file
if that's not where your history lives.

Returns a Promise resolving to an array of commands, or throwing an error if
there was an issue parsing the file.

### Input-Output Correspondence

#### zsh History Format

```
: 1471766804:3;git push origin master
```

* `1471766804`: The time the command was executed in seconds from the
  [Unix Epoch](https://en.wikipedia.org/wiki/Unix_time).
* `3`: The execution time of the command in seconds.
* `git push origin master`: The full command executed and its arguments.

#### JavaScript Parsed Command

Each command (in the array of commands promised) has four parts:

```js
{
  time: Date('2016-08-20T20:09:24.000Z'),
  executionTime: 2,
  command: 'sleep',
  arguments: [ '2' ]
}
```

* `time`: An instance of `Date`. The date and time the command was executed with
  second resolution.
* `executionTime`: The execution time of the command in seconds.
* `command`: The command executed. Just the first space-separated word from the
  full command.
* `arguments`: An array of arguments passed to the command, split with
  [argv-split](https://www.npmjs.com/package/argv-split).

### Example

Read the default `zsh-history` and log the result.

```js
require('zsh-history')().then(console.log);

[
  {
    time: Date('2016-08-20T20:09:24.000Z'),
    executionTime: 2,
    command: 'sleep',
    arguments: [ '2' ]
  },

  // many more commands
]
```

### Notes on Execution Time

You might see all `0`s for execution time, even when commands (like `sleep 1`)
don't execute instantaneously.

This likely means you are using the `INC_APPEND_HISTORY` and `SHARE_HISTORY`
options, both of which are
[oh-my-zsh defaults](https://github.com/robbyrussell/oh-my-zsh/blob/83cf8dc16f51babbb0193c5b97e568739c1f40de/lib/history.zsh#L23-L24).

These options write history to `~/.zsh_history` before the command finishes
executing so it can be immediately shared with other shell instances. A side
effect is all zero execution times, since zsh has written down the command
before it finishes.

Confusingly, `history` will report non-zero times for commands that took greater
than zero seconds in your current shell. zsh maintains an internal history for
the current shell, which `history` (aliased to `fc -l 1`) merges with
`~/.zsh_history`. The internal history contains accurate execution times
regardless of settings.

To write execution time to history, the following zsh options must be set:

```zsh
unsetopt SHARE_HISTORY
unsetopt APPEND_HISTORY
unsetopt INC_APPEND_HISTORY

setopt EXTENDED_HISTORY
setopt INC_APPEND_HISTORY_TIME
```

zsh has much more documentation on its
[history options](http://zsh.sourceforge.net/Doc/Release/Options.html#History).

#### Share History Without `SHARE_HISTORY`

To share history between shells with `SHARE_HISTORY` off, you may can to
`alias history="fc -R && fc -l 1"`, which will reload the history file when you
run `history`.

Retrieving a session's own history (ex. up arrow) will always work as expected.
