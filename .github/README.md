# isnipe

A modular sniper.

## Installation

### Core

Once you have cloned the repository, install the required dependencies with
`yarn install`, build the program with `yarn build`, and run it with `yarn
start`. You only need to build the program once, unless it is updated.

### Modules

Any modules should have their own installation guide included. Here's a basic
idea of the general steps:

1. Copy the file/folder to `src/mod/`.
2. [Enable the module](#enabling-a-module)

## Updating

If a new update is released, you will be able to update the program using `git
pull origin <branch>`.

## Config

isnipe uses the `ini` format for config files.

The root config file is found at `cfg/isnipe.ini` and has some of the default
options set.

You can include other `ini` files using `include`:

```ini
[example]
include = "example.ini"
```

`include` paths are relative to `cfg/`.

### Enabling a module

To enable an isnipe module, create a section for it in the config file, and set
`enabled` to `true`:

```ini
[example]
enabled = true
```

## Creating a module

Coming soon.
