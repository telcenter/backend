#!/bin/bash
# STOP app

cd "$(dirname "$0")"                \
&& cd ..                            \
&& pm2 stop ecosystem.config.js     \
&& echo 'TERMINATION SUCCESSFUL'    \
|| (echo 'TERMINATION FAILED' && exit 1);
