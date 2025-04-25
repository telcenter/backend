# pm2-based Production Scripts

These scripts are to be used by
the admins of the backend server
**in production**.

## Prerequisites

- Server's OS is Linux distro.
- pm2 is installed on the server.

## Usage

First, set things up. In the project root:

```sh
./scripts/update.sh
```

From then on, whenever there are new commits
in the `master` branch of the remote GitHub
repo, run this to update the app:

```sh
./scripts/update.sh
```

Whenever some environment variables are
changed, reload the app for those changes
to take effect. In case of some weird
problems, you may also try reloading the app
first.

```sh
./scripts/reload.sh
```

If the problems persist, you may try
rebuilding and reloading the app:

```sh
./scripts/rebuild.sh
```

Notify the maintainers if the problems
still do not vanish!

Finally, to stop the app:

```sh
./scripts/stop.sh
```
