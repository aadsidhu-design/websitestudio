// Simple Cloudflare Worker that proxies and secures calls to an external LLM provider
// Uses an API key from a secret stored with `wrangler secret put OPENAI_API_KEY` (or similar)
// Note: set the secret name below to match the provider you choose.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Basic helper to forward the request to an AI provider (OpenAI-style API)
 */
async function forwardToOpenAI(prompt, apiKey, model = "gpt-4o-mini") {
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 512,
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  return data;
}

async function forwardToCloudflareAI(prompt, apiKey, accountId, model = "gpt-4o-mini") {
  // NOTE: Cloudflare AI endpoint URL and payload may change over time; adapt to the
  // Cloudflare documentation for "Responses" or the Cloudflare AI endpoints you use.
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/models/${model}/responses`;
  const body = { input: prompt };
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  return await resp.json();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/ai" && request.method === "POST") {
      try {
        // Use worker secret for provider API key (set with `wrangler secret put OPENAI_API_KEY`)
        const apiKey = env.OPENAI_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "API key not configured" }), { status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
        }

        const body = await request.json();
        const prompt = body.prompt || "";
        const model = body.model || env.DEFAULT_MODEL || "gpt-4o-mini";

        if (!prompt) {
          return new Response(JSON.stringify({ error: "prompt required" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
        }

        // Forward to OpenAI (or other provider if configured)
        const provider = env.API_PROVIDER || "openai";
        let result;
        if (provider === "openai") {
          result = await forwardToOpenAI(prompt, apiKey, model);
        } else if (provider === "cloudflare") {
          const accountId = env.CF_ACCOUNT_ID;
          if (!accountId) {
            return new Response(JSON.stringify({ error: "CF_ACCOUNT_ID not configured" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
          }
          result = await forwardToCloudflareAI(prompt, apiKey, accountId, model);
        } else {
          // Extend with other providers here if needed
          return new Response(JSON.stringify({ error: "provider not supported" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify(result), { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || err.toString() }), { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
