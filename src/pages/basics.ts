import TreeElement from "tree-element";
import type { Node } from "tree-element";
import "tree-element/tree_element.css";
import "../style.css";

import { dinosaurs } from "../data";
import { byId } from "../dom";
import { logEvents } from "../eventLog";

const element = byId("tree");
const output = byId<HTMLPreElement>("output");

// With inline data the tree renders inside the constructor, so `tree.init`
// fires before the constructor returns. Add listeners first.
logEvents(element, byId("log"), [
  "tree.init",
  "tree.click",
  "tree.dblclick",
  "tree.contextmenu",
  "tree.select",
  "tree.deselect",
  "tree.open",
  "tree.close",
]);

const tree = new TreeElement({
  autoOpen: 0,
  data: dinosaurs,
  htmlElement: element,
});

const print = (text: string): void => {
  output.textContent = text;
};

// ---- Methods ---------------------------------------------------------------

let nextId = 100;

const actions: Record<string, (node: Node) => void> = {
  "add-child": (parent) => {
    const child = tree.appendNode({ id: nextId, name: `Node ${nextId}` }, parent);
    nextId += 1;

    void tree.openNode(parent);
    tree.selectNode(child);
    print(`appendNode: added "${child.name}" to "${parent.name}"`);
  },

  "add-after": (node) => {
    const sibling = tree.addNodeAfter({ id: nextId, name: `Node ${nextId}` }, node);
    nextId += 1;

    if (sibling) {
      tree.selectNode(sibling);
      print(`addNodeAfter: added "${sibling.name}" after "${node.name}"`);
    }
  },

  rename: (node) => {
    const name = window.prompt("New name", node.name);

    if (name) {
      // A string updates just the name; an object can update any property.
      tree.updateNode(node, name);
      print(`updateNode: renamed to "${name}"`);
    }
  },

  remove: (node) => {
    tree.removeNode(node);
    print(`removeNode: removed "${node.name}" and its children`);
  },

  toggle: (node) => {
    if (node.isFolder()) {
      tree.toggle(node);
      print(`toggle: "${node.name}" is now ${node.is_open ? "open" : "closed"}`);
    } else {
      print(`"${node.name}" is not a folder`);
    }
  },
};

// The toolbar buttons act on the selected node. `getSelectedNode` returns a
// falsy value when nothing is selected.
for (const [id, action] of Object.entries(actions)) {
  byId(id).addEventListener("click", () => {
    const node = tree.getSelectedNode();

    if (node) {
      action(node);
    } else {
      print("Select a node first.");
    }
  });
}

byId("select").addEventListener("click", () => {
  const id = Number(byId<HTMLInputElement>("select-id").value);
  const node = tree.getNodeById(id);

  if (node) {
    // selectNode opens the parents of the node, so it is visible.
    tree.selectNode(node);
    print(`selectNode: selected "${node.name}" (level ${node.getLevel()})`);
  } else {
    print(`getNodeById: there is no node with id ${id}`);
  }
});

byId("to-json").addEventListener("click", () => {
  // toJson includes changes made through the api.
  print(JSON.stringify(JSON.parse(tree.toJson()), null, 2));
});

// ---- Context menu ----------------------------------------------------------

const menu = byId<HTMLUListElement>("context-menu");
let menuNode: Node | null = null;

element.addEventListener("tree.contextmenu", (event) => {
  const { node, originalEvent } = event.detail;

  menuNode = node;
  menu.style.left = `${originalEvent.pageX}px`;
  menu.style.top = `${originalEvent.pageY}px`;
  menu.hidden = false;
});

menu.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest("button");
  const action = button?.dataset.action && actions[button.dataset.action];

  if (action && menuNode) {
    action(menuNode);
  }
});

document.addEventListener("click", (event) => {
  if (!menu.contains(event.target as HTMLElement)) {
    menu.hidden = true;
  }
});
