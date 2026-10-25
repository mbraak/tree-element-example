import TreeElement from "tree-element";
import type { SavedState } from "tree-element";

import { dinosaurs } from "../data";
import { byId } from "../dom";

const container = byId("trees");
const rtl = byId<HTMLInputElement>("rtl");

// The font sizes to compare. Up to 16px the toggler is 24px wide; above that
// it grows with the font.
const fontSizes = [12, 16, 20, 24, 30, 36, 48];

// ---- One tree per font size ------------------------------------------------
//
// The tree takes the font size of its element, so a font-size on the element
// is all it takes. Nothing in the options depends on it.

function createTree(
  element: HTMLElement,
  size: number,
  state: null | SavedState,
): TreeElement {
  const tree = new TreeElement({
    ariaLabel: `Dinosaurs at ${size}px`,
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

const panels = fontSizes.map((size) => {
  const panel = document.createElement("section");
  panel.className = "panel";

  const heading = document.createElement("h2");
  heading.textContent = `${size}px`;

  const element = document.createElement("div");
  element.className = "tree";
  element.style.fontSize = `${size}px`;

  panel.append(heading, element);
  container.append(panel);

  return { element, size, tree: createTree(element, size, null) };
});

// rtl can only be set in the constructor, so recreate the trees. getState and
// setState carry the open and selected nodes over.
rtl.addEventListener("change", () => {
  for (const panel of panels) {
    const state = panel.tree.getState();

    panel.tree.deinit();
    panel.tree = createTree(panel.element, panel.size, state);
  }
});
