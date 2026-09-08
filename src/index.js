export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/joke") {
      return env.ASSETS.fetch(request);
    }

    // ratelimit
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const { success } = await env.JOKE_RATE_LIMITER.limit({ key: ip });

    if (!success) {
      return Response.json(
        { error: "Too many requests." },
        { status: 429 }
      );
    }

    try {
      const { results } = await env.DB.prepare(
        "SELECT text FROM jokes ORDER BY RANDOM() LIMIT 1"
      ).all();

      const joke = results[0]?.text ?? "de grappen zijn op";
      return Response.json({ joke });
    } catch (err) {
      return Response.json(
        { error: "Fout bij fetchen grap." },
        { status: 500 }
      );
    }
  },
};
