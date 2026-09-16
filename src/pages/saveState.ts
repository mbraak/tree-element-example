import TreeElement from "tree-element";
import "tree-element/tree_element.css";
import "../style.css";

import { dinosaurs } from "../data";
import { byId } from "../dom";

const STORAGE_KEY = "tree-element-example";

const element = byId("tree");
const current = byId<HTMLPreElement>("current");
const stored = byId<HTMLPreElement>("stored");

const tree = new TreeElement({
  data: dinosaurs,
  htmlElement: element,
  // `true` uses the key "tree". A string picks the key, which matters when
  // there is more than one tree on a site.
  saveState: STORAGE_KEY,
});

function showState(): void {
  // getState reflects the tree as it is now; localStorage has what was saved.
  current.textContent = JSON.stringify(tree.getState());
  stored.textContent = localStorage.getItem(STORAGE_KEY) ?? "(nothing saved)";
}

for (const name of ["tree.open", "tree.close", "tree.select", "tree.deselect"] as const) {
  // The state is saved as part of handling these, so read it a tick later.
  element.addEventListener(name, () => setTimeout(showState));
}

showState();

byId("apply").addEventListener("click", () => {
  // setState applies a state to the tree, but does not save it: compare the
  // two panes. The next open, close or select saves the whole state.
  tree.setState({ open_nodes: [1, 3, 8], selected_node: [15] });
  showState();
});

byId("clear").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});
