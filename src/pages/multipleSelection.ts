import TreeElement from "tree-element";
import type { Node } from "tree-element";

import { dinosaurs } from "../data";
import { byId } from "../dom";
import { logEvents } from "../eventLog";

const element = byId("tree");
const selected = byId<HTMLPreElement>("selected");

logEvents(element, byId("log"), ["tree.select", "tree.deselect"]);

const tree = new TreeElement({
  ariaLabel: "Dinosaurs",
  autoOpen: 1,
  data: dinosaurs,
  htmlElement: element,
  // A click or Space adds a node to the selection, or removes it. The arrow
  // keys only move the focus. The tree also gets aria-multiselectable="true".
  multiSelect: true,
});

function showSelection(): void {
  const nodes = tree.getSelectedNodes();

  selected.textContent = nodes.length
    ? nodes.map((node) => node.name).join("\n")
    : "(nothing selected)";
}

element.addEventListener("tree.select", showSelection);
element.addEventListener("tree.deselect", showSelection);
showSelection();

// A node and all the nodes under it.
function nodeAndDescendants(parent: Node): Node[] {
  const nodes = [parent];

  parent.iterate((node) => {
    nodes.push(node);
    return true;
  });

  return nodes;
}

byId("select-theropods").addEventListener("click", () => {
  const theropods = tree.getNodeById(3);

  if (theropods) {
    // addToSelection extends the selection instead of replacing it. It works
    // without multiSelect too, and doesn't dispatch tree.select. Pass `false`
    // to leave the focus where it is.
    for (const node of nodeAndDescendants(theropods)) {
      tree.addToSelection(node, false);
    }
    showSelection();
  }
});

byId("clear").addEventListener("click", () => {
  // selectNode(null) deselects every selected node.
  tree.selectNode(null);
  showSelection();
});

byId("remove").addEventListener("click", () => {
  // removeNode also takes the node out of the selection.
  for (const node of tree.getSelectedNodes()) {
    tree.removeNode(node);
  }
  showSelection();
});
