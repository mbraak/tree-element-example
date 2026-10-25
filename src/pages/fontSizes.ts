import TreeElement from "tree-element";
import type { SavedState } from "tree-element";

import { dinosaurs } from "../data";
import { byId } from "../dom";

const element = byId("tree");
const fontSize = byId<HTMLSelectElement>("font-size");
const rtl = byId<HTMLInputElement>("rtl");

// ---- Font size -------------------------------------------------------------
//
// The tree takes the font size of its element, so setting it there is all it
// takes; the tree doesn't need to be recreated. Up to 16px the toggler is 24px
// wide; above that it grows with the font.

function applyFontSize(): void {
  element.style.fontSize = fontSize.value;
}

// The browser can keep the selected option after a reload, so apply it now.
applyFontSize();
fontSize.addEventListener("change", applyFontSize);

// ---- Creating the tree -----------------------------------------------------

function createTree(state: null | SavedState): TreeElement {
  const tree = new TreeElement({
    ariaLabel: "Dinosaurs",
    // Open two levels, so there are lines inside lines.
    autoOpen: 1,
    data: dinosaurs,
    htmlElement: element,
    rtl: rtl.checked,
  });

  if (state) {
    tree.setState(state);
  }

  return tree;
}

let tree = createTree(null);

// rtl can only be set in the constructor, so recreate the tree. getState and
// setState carry the open and selected nodes over.
rtl.addEventListener("change", () => {
  const state = tree.getState();

  tree.deinit();
  tree = createTree(state);
});
