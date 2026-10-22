# Dev container

Open this repository in VS Code or Cursor and reopen it in the dev container. You get Node.js 22.14.0, Git, vim, the Astro and Tailwind extensions, and Prettier with format-on-save. Port 4321 (Astro) and port 24678 (Vite HMR) are forwarded. `postCreateCommand` runs `.devcontainer/setup-dev-container.sh`, then `npm ci`.

The committed container is the shared toolchain. Personal preferences stay in two gitignored files.

| File                             | Purpose                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `.devcontainer/extensions.local` | Personal extension IDs, one per line                                                 |
| `.devcontainer/setup.local.sh`   | Shell script run at container create — git identity, a different shell, aliases     |

Copy the examples once:

```bash
cp .devcontainer/extensions.local.example .devcontainer/extensions.local
cp .devcontainer/setup.local.sh.example   .devcontainer/setup.local.sh
```

Search for an extension, open its gear menu, and choose Copy Extension ID. Put that ID in `extensions.local`.

`setup-dev-container.sh` installs those extensions only after the editor IPC socket answers. `postCreateCommand` starts before `code --install-extension` will succeed, and in Cursor the `code` command on `PATH` can be a shim. The script finds a working socket under `/tmp/vscode-ipc-*.sock` (and the Cursor remote CLI, when that shim is present) and then installs. If the local files are missing, it says so and continues.

`runArgs` maps `host.docker.internal` to the host, so a process in the container can reach a service on your machine. Use that from `setup.local.sh` when a personal tool needs the host — for example a shell-history sync server.

The Dockerfile is for packages everyone on the repo needs. This image installs vim. Add shared packages there. Put tools only you want in `setup.local.sh`.
