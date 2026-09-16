import { fileURLToPath } from "node:url";
import { defineConfig, type Connect, type Plugin } from "vite";

import { childrenOf, topLevel } from "./src/data.ts";

/**
 * A stand-in for a server that answers the tree's requests. It is used by the
 * load-on-demand page:
 *
 *   GET /api/nodes            -> the top level, with `load_on_demand` on folders
 *   GET /api/nodes?node=<id>  -> the children of that node, or a 404
 *
 * The tree also appends `_=<timestamp>` to defeat caching. Ignore it.
 */
function fakeNodesApi(): Plugin {
  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const url = new URL(req.url ?? "/", "http://localhost");

    if (url.pathname !== "/api/nodes") {
      next();
      return;
    }

    const nodeId = url.searchParams.get("node");
    const nodes = nodeId === null ? topLevel() : childrenOf(nodeId);

    // Slow the response down a bit so the loading indicator is visible.
    setTimeout(() => {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");

      if (nodes === null) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: `no node with id ${nodeId}` }));
      } else {
        res.end(JSON.stringify(nodes));
      }
    }, 400);
  };

  return {
    name: "fake-nodes-api",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

const page = (name: string) => fileURLToPath(new URL(`${name}.html`, import.meta.url));

export default defineConfig({
  plugins: [fakeNodesApi()],
  build: {
    rollupOptions: {
      input: {
        index: page("index"),
        "drag-and-drop": page("drag-and-drop"),
        "load-on-demand": page("load-on-demand"),
        "save-state": page("save-state"),
        styling: page("styling"),
      },
    },
  },
});
