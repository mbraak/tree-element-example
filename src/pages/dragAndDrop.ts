import TreeElement from "tree-element";
import type { MoveInfo } from "tree-element";
import "tree-element/tree_element.css";
import "../style.css";

import { dinosaurs } from "../data";
import { byId } from "../dom";
import { appendLine, logEvents } from "../eventLog";

const element = byId("tree");
const log = byId("log");

logEvents(element, log, ["tree.move", "tree.open"]);

const tree = new TreeElement({
  autoOpen: 1,
  data: dinosaurs,
  dragAndDrop: true,
  htmlElement: element,

  // The two top-level groups cannot be dragged...
  onCanMove: (node) => node.getLevel() > 1,

  // ...and nothing can be dropped before or after them. Dropping inside them
  // is fine.
  onCanMoveTo: (_movedNode, targetNode, position) =>
    position === "inside" || targetNode.getLevel() > 1,

  onDragStop: (node) => {
    appendLine(log, `onDragStop ${node.name}`);
  },
});

// ---- Confirming a move -----------------------------------------------------
//
// `tree.move` is dispatched when a node is dropped. Calling `preventDefault`
// keeps the tree as it is; `moveInfo.doMove()` applies the move later. This is
// how you wait for a server to confirm the move.

const confirmCheckbox = byId<HTMLInputElement>("confirm");
const confirmBar = byId("confirm-bar");
const confirmText = byId("confirm-text");
let pendingMove: MoveInfo | null = null;

element.addEventListener("tree.move", (event) => {
  if (!confirmCheckbox.checked) {
    return;
  }

  const { moveInfo } = event.detail;

  event.preventDefault();
  pendingMove = moveInfo;

  const from = moveInfo.previousParent?.name ?? "the top level";
  confirmText.textContent = `Move "${moveInfo.movedNode.name}" out of "${from}" to ${moveInfo.position} "${moveInfo.targetNode.name}"?`;
  confirmBar.hidden = false;
});

byId("confirm-yes").addEventListener("click", () => {
  pendingMove?.doMove();
  appendLine(log, "doMove");
  pendingMove = null;
  confirmBar.hidden = true;
});

byId("confirm-no").addEventListener("click", () => {
  pendingMove = null;
  confirmBar.hidden = true;
});

// ---- Moving from code ------------------------------------------------------

byId("move-from-code").addEventListener("click", () => {
  const avialans = tree.getNodeById(15);
  const ornithopods = tree.getNodeById(28);

  if (avialans && ornithopods) {
    tree.moveNode(avialans, ornithopods, "inside");
    void tree.openNode(ornithopods);
    tree.selectNode(avialans);
    appendLine(log, "moveNode Avialans inside Ornithopods");
  }
});

byId("reset").addEventListener("click", () => {
  tree.loadData(dinosaurs);
  appendLine(log, "loadData");
});
