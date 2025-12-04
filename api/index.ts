{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist/public",
  "installCommand": "pnpm install",
  "framework": null,
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node@3.2.0",
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "rewrites": [
    {
      "source": "/api/trpc/:path*",
      "destination": "/api"
    },
    {
      "source": "/api/oauth/:path*",
      "destination": "/api"
    },
    {
      "source": "/api/dashboard/:path*",
      "destination": "/api"
    },
    {
      "source": "/api/health",
      "destination": "/api"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    }
  ]
}
