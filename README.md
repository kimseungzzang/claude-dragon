# claude-dragon

A desktop companion that appears every time Claude Code finishes a response.

A transparent, always-on-top Electron overlay. When Claude stops, a dragon flies in from the corner of your screen, breathes fire, shows the current project name in a speech bubble, then flies away.

## How it works

```
Claude finishes response
        ↓
Stop hook → HTTP POST to localhost:3939
        ↓
Dragon flies in (bottom-right corner)
        ↓
Breathes fire + shows project name
        ↓
Flies away
```

The window is transparent, frameless, always-on-top, and click-through — it never interferes with your work.

## Setup

**1. Clone and install**

```bash
git clone https://github.com/Kimseungzzang/claude-dragon.git
cd claude-dragon
npm install
```

**2. Register the Stop hook**

If you use [zzang-claude-skills](https://github.com/Kimseungzzang/kimseungzzang-claude-skills), the hook is registered automatically by the installer.

To register manually, add this to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "curl -s -X POST -H 'Content-Type: application/json' -d @- http://127.0.0.1:3939/notify > /dev/null 2>&1 || true"
          }
        ]
      }
    ]
  }
}
```

**3. Run**

```bash
npm start
```

Keep it running in the background. It responds to every Claude session on your machine as long as it's running.

## Requirements

- macOS
- Node.js
- Electron (installed via `npm install`)
