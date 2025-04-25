#!/bin/bash
# UPDATE, REBUILD, AND RELOAD app

cd "$(dirname "$0")"            \
&& cd ..                        \
&& git checkout master          \
&& git pull origin master       \
&& ./scripts/rebuild.sh         \
&& echo 'UPDATE SUCCESSFUL'     \
|| (echo 'UPDATE FAILED' && exit 1);
