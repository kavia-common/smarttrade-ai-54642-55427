#!/bin/bash
cd /home/kavia/workspace/code-generation/smarttrade-ai-54642-55427/trading_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

