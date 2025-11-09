# Fix for "EMFILE: too many open files" Error

## Quick Fix (Current Session)
Run this command in your terminal before starting Metro:
```bash
ulimit -n 4096
```

## Permanent Fix (System-wide)

### Option 1: Using launchctl (Recommended)

Create a plist file to increase file limits permanently:

1. Create the plist file:
```bash
sudo nano /Library/LaunchDaemons/limit.maxfiles.plist
```

2. Add the following content:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>limit.maxfiles</string>
    <key>ProgramArguments</key>
    <array>
      <string>launchctl</string>
      <string>limit</string>
      <string>maxfiles</string>
      <string>65536</string>
      <string>200000</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>ServiceIPC</key>
    <false/>
  </dict>
</plist>
```

3. Set proper permissions:
```bash
sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chmod 644 /Library/LaunchDaemons/limit.maxfiles.plist
```

4. Load the plist:
```bash
sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

5. Verify it's loaded:
```bash
launchctl limit maxfiles
```

You should see output like:
```
maxfiles    65536           200000
```

### Option 2: Add to your shell profile

Add this line to your `~/.zshrc` (since you're using zsh):
```bash
ulimit -n 4096
```

Then reload your shell:
```bash
source ~/.zshrc
```

## Using the Helper Script

You can also use the provided `start.sh` script:
```bash
./start.sh
```

Or update your package.json to use it:
```json
"start": "./start.sh"
```

## Note

Watchman is already installed on your system, which is more efficient than Node's file watcher. Metro should automatically use it, which helps reduce the number of file descriptors needed.

