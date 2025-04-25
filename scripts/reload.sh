#!/bin/bash
# RELOAD app (DO NOT UPDATE OR REBUILD)

cd "$(dirname "$0")"                \
&& cd ..                            \
&& pm2 reload ecosystem.config.js   \
&& echo 'RELOAD SUCCESSFUL'         \
|| (echo 'RELOAD FAILED' && exit 1);
