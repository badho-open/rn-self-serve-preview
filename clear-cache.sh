#!/bin/bash

echo "🧹 Clearing React Native caches..."

# Clear watchman watches
echo "Clearing watchman watches..."
watchman watch-del-all 2>/dev/null || true

# Clear Metro bundler cache
echo "Clearing Metro bundler cache..."
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true
rm -rf /tmp/react-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true

# Clear node_modules cache
echo "Clearing node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null || true

# Clear iOS build cache (if exists)
echo "Clearing iOS build cache..."
rm -rf ios/build 2>/dev/null || true
rm -rf ios/Pods 2>/dev/null || true
rm -rf ios/Podfile.lock 2>/dev/null || true

# Clear Android build cache (if exists)
echo "Clearing Android build cache..."
rm -rf android/app/build 2>/dev/null || true
rm -rf android/.gradle 2>/dev/null || true
rm -rf android/build 2>/dev/null || true

# Clear Metro cache directory
echo "Clearing Metro cache directory..."
rm -rf .metro 2>/dev/null || true

# Reset watchman
echo "Resetting watchman..."
watchman shutdown-server 2>/dev/null || true

echo "✅ Cache clearing complete!"
echo ""
echo "Now you can start Metro with:"
echo "  yarn start --reset-cache"
echo "  or"
echo "  npx react-native start --reset-cache"

