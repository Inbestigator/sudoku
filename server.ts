import { bundle } from "@libs/bundle/ts/bundle";

Deno.writeTextFileSync(
  "./bundle.js",
  await bundle(Deno.readTextFileSync("main.ts"), {
    minify: "terser",
  }),
);

Deno.serve((req) => {
  if (new URL(req.url).pathname === "/bundle.js") {
    return new Response(Deno.readTextFileSync("bundle.js"));
  }
  return new Response(Deno.readTextFileSync("index.html"), {
    headers: {
      "content-type": "text/html; charset=UTF-8",
    },
  });
});
