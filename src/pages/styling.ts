import TreeElement from "tree-element";
import type { Node, SavedState } from "tree-element";
import "tree-element/tree_element.css";
import "../style.css";
import "./styling.css";

import { dinosaurs } from "../data";
import { byId } from "../dom";

const element = byId("tree");

const rtl = byId<HTMLInputElement>("rtl");
const buttonRight = byId<HTMLInputElement>("button-right");
const noSlide = byId<HTMLInputElement>("no-slide");
const showNotes = byId<HTMLInputElement>("show-notes");

// ---- Icons -----------------------------------------------------------------
//
// closedIcon and openedIcon take an html string or an element. The string is
// parsed once and cloned for every folder, so inline svg can go straight in.
// The default closed icon flips in rtl mode; a custom one has to do that
// itself.

const chevron = (direction: "down" | "left" | "right"): string => {
  const path = {
    down: "M3 6l5 5 5-5",
    left: "M10 3L5 8l5 5",
    right: "M6 3l5 5-5 5",
  }[direction];

  return `<svg class="chevron" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="${path}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
};

// ---- Extra markup per node -------------------------------------------------
//
// onCreateLi is called when the `li` of a node is rendered, and again whenever
// the node is refreshed. Build the markup from the node data every time.

function addNoteAndCount(node: Node, li: HTMLElement): void {
  const title = li.querySelector(".tree-element-title");

  if (!title) {
    return;
  }

  // Extra keys in the node data end up as properties on the node, typed as
  // `unknown`.
  if (typeof node.note === "string") {
    const note = document.createElement("span");
    note.className = "note";
    note.textContent = node.note;
    title.after(note);
  }

  if (node.isFolder()) {
    const count = document.createElement("span");
    count.className = "count";
    count.textContent = String(node.children.length);
    title.after(count);
  }
}

// ---- Creating the tree -----------------------------------------------------

function createTree(state: null | SavedState): TreeElement {
  const isRtl = rtl.checked;

  const tree = new TreeElement({
    autoOpen: 0,
    buttonLeft: !buttonRight.checked,
    closedIcon: chevron(isRtl ? "left" : "right"),
    data: dinosaurs,
    htmlElement: element,
    onCreateLi: showNotes.checked ? addNoteAndCount : undefined,
    openedIcon: chevron("down"),
    rtl: isRtl,
    slide: !noSlide.checked,
  });

  if (state) {
    tree.setState(state);
  }

  return tree;
}

let tree = createTree(null);

// The options above cannot all be changed with setOption, so recreate the
// tree. deinit empties the element and removes the tree's document-level
// listeners; getState and setState carry the open and selected nodes over.
for (const checkbox of [rtl, buttonRight, noSlide, showNotes]) {
  checkbox.addEventListener("change", () => {
    const state = tree.getState();

    tree.deinit();
    tree = createTree(state);
  });
}
