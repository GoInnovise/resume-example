FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Shared tools for everyone who opens this repo.
# Personal tools (shell, git identity, extra CLIs) belong in setup.local.sh.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends vim \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ARG USERNAME=node
