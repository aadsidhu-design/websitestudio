# Cloudflare Worker AI Proxy

This small Cloudflare Worker provides a simple proxy for sending prompts to an LLM provider (OpenAI-compatible or Cloudflare Models) and returning the JSON response over HTTP. It stores the LLM key using Worker secrets and shields it from clients.

Features:
- /health - simple health check
- /ai (POST) - JSON body { "prompt": "...", "model": "...optional..." }

Quickstart
1. Install Wrangler CLI and login:
```bash
npm install -g wrangler
wrangler login
```

2. Set the API key secret (OpenAI example):
```bash
cd workers/ai-proxy
wrangler secret put OPENAI_API_KEY
```

3. Optionally set a default model (not secret):
Add a `DEFAULT_MODEL` variable to `wrangler.toml` or set it in the worker environment. Example in `wrangler.toml`:
```toml
[vars]
DEFAULT_MODEL = "gpt-4o-mini"
```

4. Publish the worker:
```bash
wrangler publish
```

5. Send a request (replace with your worker URL):
```bash
curl -X POST "https://websitestudio-ai-proxy.your-subdomain.workers.dev/ai" \
  -H 'Content-Type: application/json' \
  --data '{"prompt":"Hello from CF Worker!"}'
```

Cloudflare AI (optional)
- If you prefer to call Cloudflare's own AI endpoints, set the provider to `cloudflare` in `wrangler.toml`'s `[vars]` or use environment variables and add a `CF_ACCOUNT_ID` var (the worker reads `env.CF_ACCOUNT_ID`).
- For example edit `workers/ai-proxy/wrangler.toml`:
```toml
[vars]
API_PROVIDER = "cloudflare"
CF_ACCOUNT_ID = "0123456789abcdef0123456789abcdef"
```
- Set the Cloudflare API token as the same `OPENAI_API_KEY` secret (or create `CF_API_TOKEN` and update worker code to use it).
- Confirm the Cloudflare model and payload format from Cloudflare's documentation and change the payload format in the worker if needed.

Security & production notes
- Use `wrangler secret put` for private API tokens. Do not check secret values into git.
- Add authentication or rate-limiting to prevent abuse, e.g., a simple API key or JWT check inside the worker.
- Add logging and a usage quota if you expect public traffic.

Custom providers and extensions
- The worker is intentionally simple; it shows how to dispatch to OpenAI or Cloudflare AI. Add additional providers or streaming-based responses as needed.
# Cloudflare Worker AI Proxy

This small Cloudflare Worker provides a simple proxy for sending prompts to an LLM provider (OpenAI-compatible) and returning the JSON response over HTTP. It stores the LLM key using Worker secrets and shields it from clients.

Features:
- /health - simple health check
- /ai (POST) - JSON body { "prompt": "...", "model": "...optional..." }

How to use
1. Install Wrangler CLI and login:
```bash
npm install -g wrangler
wrangler login
```

2. Set the API key secret (OpenAI example):
```bash
cd workers/ai-proxy
wrangler secret put OPENAI_API_KEY
```

3. Optionally set a default model (not secret):
Add a `DEFAULT_MODEL` variable to `wrangler.toml` or set it in the worker environment. Example in `wrangler.toml`:
```toml
[vars]
DEFAULT_MODEL = "gpt-4o-mini"
```

4. Publish the worker:
```bash
wrangler publish
```

5. Send a request (replace with your worker URL):
```bash
curl -X POST "https://websitestudio-ai-proxy.your-subdomain.workers.dev/ai" \
  -H 'Content-Type: application/json' \
  --data '{"prompt":"Hello from CF Worker!"}'
```

- Prefer using `wrangler secret put` to store API keys. Never hardcode them.
- For production apps, add rate-limiting, authentication and usage logging to prevent abuse.
- If you want to use Cloudflare's own AI product when it becomes available in your account, swap the fetch URL and headers to match the Cloudflare API as documented by Cloudflare.
Notes & Security
- Prefer using `wrangler secret put` to store API keys. Never hardcode them.
- For production apps, add rate-limiting, authentication and usage logging to prevent abuse.
- The worker currently proxies to OpenAI-style chat completion endpoints. If you want to use Cloudflare's AI products (Cloudflare AI / Models), consult Cloudflare's docs and change the fetch URL, headers, and payload format to match their API.
- Prefer using `wrangler secret put` to store API keys. Never hardcode them.
- For production apps, add rate-limiting, authentication and usage logging to prevent abuse.
- If you want to use Cloudflare's own AI product when it becomes available in your account, swap the fetch URL and headers to match the Cloudflare API as documented by Cloudflare.
