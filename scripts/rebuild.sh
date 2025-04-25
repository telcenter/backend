#!/bin/bash
# REBUILD AND RELOAD app

cd "$(dirname "$0")"                                    \
&& cd ..                                                \
&& mkdir -p .npm                                        \
&& cd .npm                                              \
&& export npm_config_cache=$(pwd)                       \
&& cd ..                                                \
&& npm install                                          \
&& npx prisma migrate deploy                            \
&& npx prisma generate                                  \
&& npm run build                                        \
&& ./scripts/reload.sh                                  \
&& echo 'REBUILD SUCCESSFUL'                            \
|| (echo 'REBUILD FAILED' && exit 1);
