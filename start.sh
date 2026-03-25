#!/usr/bin/env bash
cd "$(dirname "$0")"

PORT=5173

# Kill any process using the port
PID=$(lsof -ti tcp:"$PORT" 2>/dev/null)
if [ -n "$PID" ]; then
  echo "⚠ Killing process(es) on port $PORT (PID: $PID)"
  kill -9 $PID 2>/dev/null
  sleep 0.5
fi

npm install --silent 2>/dev/null
npx vite --port "$PORT"
