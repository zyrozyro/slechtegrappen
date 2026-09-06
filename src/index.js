export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only handle our API route here. Everything else (the static
    // site) is served automatically by the [assets] binding in
    // wrangler.toml, so we don't need to write any code for it.
    if (url.pathname !== "/api/joke") {
      return env.ASSETS.fetch(request);
    }

    // --- Rate limiting ---
    // We key the limiter on the caller's IP address, so each visitor
    // gets their own bucket of 10 requests / 60 seconds (configured
    // in wrangler.toml). This runs at Cloudflare's edge, before your
    // code does any real work, so it's cheap even under abuse.
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const { success } = await env.JOKE_RATE_LIMITER.limit({ key: ip });

    if (!success) {
      return Response.json(
        { error: "Too many requests. Please slow down and try again shortly." },
        { status: 429 }
      );
    }

    // --- Fetch a random joke from D1 ---
    try {
      const { results } = await env.DB.prepare(
        "SELECT text FROM jokes ORDER BY RANDOM() LIMIT 1"
      ).all();

      const joke = results[0]?.text ?? "de grappen zijn op";
      return Response.json({ joke });
    } catch (err) {
      return Response.json(
        { error: "Something went wrong fetching a joke." },
        { status: 500 }
      );
    }
  },
};
