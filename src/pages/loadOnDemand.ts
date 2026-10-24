import TreeElement from "tree-element";

import { byId } from "../dom";
import { logEvents } from "../eventLog";

const element = byId("tree");
const output = byId<HTMLPreElement>("output");

logEvents(element, byId("log"), [
  "tree.init",
  "tree.loading_data",
  "tree.loaded_data",
  "tree.set_data",
  "tree.load_failed",
  "tree.open",
]);

// The tree treats a relative url as relative to the root of the site, so
// resolve it against the page. This keeps it working when the site is served
// from a subdirectory, such as on GitHub Pages.
const apiUrl = (path: string): string => new URL(path, document.baseURI).href;

const tree = new TreeElement({
  ariaLabel: "Dinosaurs",
  // Called without a node for the initial load, and with the node that is
  // being opened for a subtree. The server marks nodes that have children
  // with `load_on_demand: true`; see vite.config.ts.
  dataUrl: (node) =>
    apiUrl(node ? `api/nodes/${node.id}.json` : "api/nodes.json"),
  htmlElement: element,
});

const print = (text: string): void => {
  output.textContent = text;
};

// ---- Opening a node that is not loaded yet ---------------------------------
//
// Coelurosaurians (8) is inside Theropods (3), which is inside Saurischia (1).
// None of them are loaded initially, so open the path one node at a time.
// `openNode` returns a promise that resolves after the children have arrived.

byId("open-deep").addEventListener("click", async () => {
  for (const id of [1, 3, 8]) {
    const node = tree.getNodeById(id);

    if (!node) {
      print(`node ${id} is not loaded`);
      return;
    }

    await tree.openNode(node);
  }

  const node = tree.getNodeById(8);

  if (node) {
    tree.selectNode(node);
    print(`opened and selected "${node.name}"`);
  }
});

byId("reload").addEventListener("click", async () => {
  // Without arguments, loadDataFromUrl fetches `dataUrl` into the whole tree.
  await tree.loadDataFromUrl();
  print("reloaded the top level");
});

byId("fail").addEventListener("click", async () => {
  // A response with an error status dispatches `tree.load_failed` and leaves
  // the tree as it is.
  await tree.loadDataFromUrl(apiUrl("api/nodes/does-not-exist.json"));
  print("the request failed, see the events");
});
