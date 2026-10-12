import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Connect, type Plugin } from "vite";

import { childrenOf, nodeIds, topLevel } from "./src/data.ts";

/**
 * A stand-in for a server that answers the tree's requests. It is used by the
 * load-on-demand page:
 *
 *   GET api/nodes.json       -> the top level, with `load_on_demand` on folders
 *   GET api/nodes/<id>.json  -> the children of that node, or a 404
 *
 * The urls look like static files so that the build can contain the same
 * responses as real files, and a static host such as GitHub Pages can serve
 * them. The tree also appends `_=<timestamp>` to defeat caching. Ignore it.
 */
function fakeNodesApi(): Plugin {
  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const match = /\/api\/nodes(?:\/([^/]+))?\.json$/.exec(url.pathname);

    if (!match) {
      next();
      return;
    }

    const nodeId = match[1];
    const nodes = nodeId === undefined ? topLevel() : childrenOf(nodeId);

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
    // Write every response into the build. Unknown ids get no file, so a
    // static host answers them with a 404, like the dev server does.
    generateBundle() {
      const emitJson = (fileName: string, data: unknown) =>
        this.emitFile({ type: "asset", fileName, source: JSON.stringify(data) });

      emitJson("api/nodes.json", topLevel());

      for (const id of nodeIds()) {
        emitJson(`api/nodes/${id}.json`, childrenOf(String(id)));
      }
    },
  };
}

/**
 * The pages of the example, in the order of the nav. Each one is an html file
 * in the root, and an entry of the build.
 */
const pages = [
  { name: "index", title: "Basics" },
  { name: "drag-and-drop", title: "Drag and drop" },
  { name: "load-on-demand", title: "Load on demand" },
  { name: "save-state", title: "Save state" },
  { name: "styling", title: "Styling" },
  { name: "accessibility", title: "Accessibility" },
];

const pageUrl = (name: string) => (name === "index" ? "./" : `./${name}.html`);

/**
 * Replaces the `<!-- header -->` comment in each page with the header, so that
 * the pages share it. The link to the current page gets `aria-current`.
 */
function sharedHeader(): Plugin {
  return {
    name: "shared-header",
    transformIndexHtml(html, ctx) {
      const current = basename(ctx.filename, ".html");
      const links = pages
        .map(({ name, title }) => {
          const ariaCurrent = name === current ? ' aria-current="page"' : "";
          return `        <a href="${pageUrl(name)}"${ariaCurrent}>${title}</a>`;
        })
        .join("\n");

      const header = `    <header>
      <h1><a href="./">tree-element example</a></h1>
      <nav>
${links}
      </nav>
      <a class="repo-link" href="https://github.com/mbraak/tree-element-example">GitHub</a>
    </header>`;

      if (!html.includes("<!-- header -->")) {
        throw new Error(`${ctx.filename} has no <!-- header --> comment`);
      }

      return html.replace("    <!-- header -->", header);
    },
  };
}

export default defineConfig({
  // Relative urls, so the build works from any path, such as
  // https://mbraak.github.io/tree-element-example/
  base: "./",
  plugins: [fakeNodesApi(), sharedHeader()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map(({ name }) => [name, fileURLToPath(new URL(`${name}.html`, import.meta.url))]),
      ),
    },
  },
});
