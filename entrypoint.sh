#!/bin/sh
set -e

# Inject runtime environment variables vào JS bundle cho client-side
# Thay thế placeholder __NEXT_PUBLIC_API_URL__ bằng giá trị thực từ env
if [ -n "$NEXT_PUBLIC_API_URL" ]; then
    echo "Injecting NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
    find /app/.next -name "*.js" -type f -exec sed -i "s|__NEXT_PUBLIC_API_URL__|${NEXT_PUBLIC_API_URL}|g" {} \; 2>/dev/null || true
else
    echo "Warning: NEXT_PUBLIC_API_URL is not set, using default"
    find /app/.next -name "*.js" -type f -exec sed -i "s|__NEXT_PUBLIC_API_URL__|http://localhost:8080/api|g" {} \; 2>/dev/null || true
fi

echo "Starting Next.js server..."
exec node server.js
