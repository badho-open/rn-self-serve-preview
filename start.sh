#!/bin/bash

# Increase file descriptor limit for Metro bundler
ulimit -n 4096

# Start React Native Metro bundler
# Use --reset-cache flag if you want to clear cache
if [ "$1" == "--reset-cache" ]; then
  npx react-native start --reset-cache
else
  npx react-native start
fi

