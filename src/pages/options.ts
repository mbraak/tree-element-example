import TreeElement from "tree-element";

import { dinosaurs } from "../data";
import { byId } from "../dom";
import { appendLine, logEvents } from "../eventLog";

const element = byId("tree");
const log = byId("log");
const selected = byId<HTMLPreElement>("selected");

logEvents(element, log, ["tree.select", "tree.deselect", "tree.move"]);

const checkbox = (id: string) => byId<HTMLInputElement>(id);

// Start the tree with the options the checkboxes show. The browser can keep
// checkboxes checked after a reload, so read them instead of hardcoding.
const tree = new TreeElement({
  ariaLabel: "Dinosaurs",
  autoOpen: 0,
  data: dinosaurs,
  dragAndDrop: checkbox("dragAndDrop").checked,
  htmlElement: element,
  keyboardSupport: checkbox("keyboardSupport").checked,
  multiSelect: checkbox("multiSelect").checked,
  selectable: checkbox("selectable").checked,
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

// ---- Changing the options --------------------------------------------------
//
// setOption applies the change right away:
//
// - dragAndDrop: nodes can be dragged, or not.
// - keyboardSupport: the arrow keys, Home, End, Enter and Space are handled by
//   the tree, or do what they normally do on the page.
// - multiSelect: a click toggles a node in the selection, or replaces the
//   selection. The tree also gets or loses aria-multiselectable="true".
// - selectable: clicks and keys select nodes, or don't.
//
// The selection is kept. Turning multiSelect off leaves several nodes
// selected until the next click selects one; turning selectable off leaves the
// selected nodes selected.
//
// setOption throws for an option that can only be set in the constructor,
// such as rtl or onCreateLi. See the styling page for recreating the tree.

const changeable = [
  "dragAndDrop",
  "keyboardSupport",
  "multiSelect",
  "selectable",
] as const;

for (const option of changeable) {
  const input = checkbox(option);

  input.addEventListener("change", () => {
    tree.setOption(option, input.checked);
    appendLine(log, `setOption ${option} ${input.checked}`);
  });
}
