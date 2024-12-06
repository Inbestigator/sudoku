import CaptureClient from "@capture/analytics";

const analytics = new CaptureClient({
  projectId: "SMTi_VwQN",
  key: "cak_rMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgFogGB7AEy9yQ6+iz",
});

Deno.serve(async (req) => {
  switch (new URL(req.url).pathname) {
    case "/bundle.js":
      return new Response(Deno.readTextFileSync("bundle.js"), {
        headers: {
          "content-type": "application/javascript; charset=UTF-8",
        },
      });
    case "/api/plays": {
      const fingerprint = new URL(req.url).searchParams.get("fingerprint");
      if (!fingerprint) return new Response(null, { status: 400 });
      const recap = await analytics.recap(["win"]);
      return new Response(
        JSON.stringify(
          recap?.filter(
            (r) => (r.data as { print: string }).print === fingerprint,
          ),
        ),
        {
          headers: {
            "content-type": "application/json; charset=UTF-8",
          },
        },
      );
    }
    case "/":
      return new Response(Deno.readTextFileSync("index.html"), {
        headers: {
          "content-type": "text/html; charset=UTF-8",
        },
      });
  }

  return new Response(null, {
    status: 404,
  });
});
