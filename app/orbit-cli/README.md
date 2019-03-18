# orbit-cli

## Orbit App Format

Orbit app is a git repository (it's recommended to name it with `-orbit` suffix)
which adheres to a set of conventions:

1. It is a valid npm package (has `package.json` file with valid npm metadata).

2. Its `package.json` has `"orbit"` section which has the following format:

- `"title"` specifies application title

- `"require"` specifies runtime requirements for the app, the following is
  optional:

  - `"orbit"` specifies the version of Orbit runtime required for this app (`1`
    is the only valid option for now)

- `"workers"` specifies a set of processes which are started when the app starts

- …

The example `package.json` for an app could look like:

```
{
  "name": "my-app",
  "orbit": {
    "title": "My App",
    "require": {
      "orbit": 1
    },
    "workers": {
      "sync-discord": {
        "command": ["node", "./sync-discord.js"]
      }
    }
  }
}
```

## Installing Orbit Runtime

Orbit runtime is distributed through npm:

    % npm install --global orbit

After it's installed the `orbit` command is available on `$PATH`, try it with:

    % orbit --version

## Running an Orbit App

You can start an app with the following invocation:

    % orbit run GIT_REPO_URL[#REFSPEC]

Where:

- `GIT_REPO_URL` is an URL to a git repository with the app source code, this
  can be a local git repository.
- `REFSPEC` is an optional part which specifies git reference to use (commit,
  branch, tag), it's default to `master` if not specified.

Orbit will checkout the app's source code into a cache, install all dependencies
and start an application window and configured processes.

Note that `orbit run` won't install the app - all app's data can be removed any
time. If you want to continue using the app - you should install it, either
using `"Install App"` button or using `orbit install` command.

## Installing an Orbit App

You can start an install an app with following invocation:

    % orbit install [OPTIONS] GIT_REPO_URL[#REFSPEC]

This will install it into your current workspace, which if you are working with
a team will install it for your entire team to use.

By default, Orbit creates your apps inside `~/orbit-[workspacename]/[package-name]`. Where package-name is the unique name in the package.json

## Listing Orbit Apps

List installed orbit apps:

    % orbit ls

List all orbit apps available (this will lists also apps which were run but not
installed, can be used to install apps which you want to continue to use):

    % orbit ls --all

## Workspaces

Workspaces are where Orbit apps live together. They let teams collaborate on
their apps. To view your workspace use:

    % orbit ws

You can view information on a specific workspace:

    % orbit ws apps

And view members of your current workspace:

    $ orbit ws members

## Editing apps

If you have access to the github repo, you can make changes to your the source
freely and submit them to the app.
