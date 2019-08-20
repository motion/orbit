# Orbit

The Orbit CLI is used to develop and deploy apps with Orbit. The apps can run in a couple ways:

1. Individually on their own, in their own window.
2. Together in a workspace.

--

## Developing the cli

To work on cli, run orbit in dev mode as usual with `run orbit`, then use `bin/orbit dev /path/to/custom-app` — it should fork a new instance with a running custom app.

---

## Step 1: Developing Individual Apps

### Orbit App Format

Orbit app is a git repository (it's recommended to name it with `-orbit` suffix)
which adheres to a set of conventions:

1. It is a valid npm package (has `package.json` file with valid npm metadata).

2. Its `package.json` has `"orbit"` section which has the following format:

- `"id"` optional, lets you reserve a name in orbit app registry

- `"title"` specifies application title

- `"require"` specifies runtime requirements for the app, the following is
  optional:

  - `"orbit"` specifies the version of Orbit runtime required for this app (`1`
    is the only valid option for now)

- …

The example `package.json` for an app could look like:

```
{
  "name": "my-app",
  "orbit": {
    "id": "my-app",
    "title": "My App",
    "require": {
      "orbit": 1
    }
  }
}
```

### Installing Orbit Runtime

The CLI lives in app/orbit as `orbit`. Eventually it will be bundled together with the app-kit under one name, the npm package `orbit`.

Orbit runtime is distributed through npm:

    % npm install --global orbit

After it's installed the `orbit` command is available on `$PATH`, try it with:

    % orbit --version

### Running an Orbit App

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

### Installing an Orbit App

You can start an install an app with following invocation:

    % orbit install [OPTIONS] GIT_REPO_URL[#REFSPEC]

This will install it into your current workspace, which if you are working with
a team will install it for your entire team to use.

By default, Orbit creates your apps inside
`~/orbit-[workspacename]/[package-name]`. Where package-name is the unique name
in the package.json. You can configure this location in the orbit configuration,
at `~/.orbit.json`.

### Listing Orbit Apps

List installed orbit apps:

    % orbit ls

List all orbit apps available (this will lists also apps which were run but not
installed, can be used to install apps which you want to continue to use):

    % orbit ls --all

---

## Workspaces

Workspaces are where Orbit apps live together. They let teams collaborate on
their apps.

Workspaces live in `~/.orbit/[workspace]`. Your apps for each workspace are then
in `~/.orbit/[workspace]/[app]`. Configuration for your workspace lives in `~/.orbit/[workspace]/workspace.json`.

To view your current workspace use:

    % orbit ws

You can view information on a specific workspace:

    % orbit ws apps

And view members of your current workspace:

    % orbit ws members

To switch a workspace:

    % orbit ws switch [name]

And to create a new workspace:

    % orbit ws create [name]

### Editing apps

You can edit apps through the GUI by hitting the `Edit` option in the menu of
any app. You can also just work on it through the command line.

You can run `orbit dev` inside any app folder to edit it. As a helper, you can
type `orbit dev [package-name]` to edit any app within your current workspace.

Publishing is as simple as pushing to your git repo. Other members of your
workspace will be prompted to update the app with a notification that shows the
message you include in your commit message.

### Searching for apps

Orbit hosts an app store that helps you find new apps. To search them just use:

    % orbit search [query]

That will return a list of apps that you can install by their unique github
repo. Apps that are published in the main orbit repo will reserve their
package.json name for easier usage. So you can install search and install:

```
% orbit search slack

  - slack  (https://github.com/orbit/slack)

% orbit install slack
% orbit run slack

```
