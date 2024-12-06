Deno.serve((req) => {
  if (new URL(req.url).pathname === "/bundle.js") {
    return new Response(Deno.readTextFileSync("bundle.js"), {
      headers: {
        "content-type": "application/javascript; charset=UTF-8",
      },
    });
  }
  return new Response(Deno.readTextFileSync("index.html"), {
    headers: {
      "content-type": "text/html; charset=UTF-8",
    },
  });
});
