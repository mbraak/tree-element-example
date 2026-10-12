import TreeElement from "tree-element";
import type { SavedState } from "tree-element";

import { dinosaurs } from "../data";
import { byId } from "../dom";
import { appendLine } from "../eventLog";

const element = byId("tree");
const announcements = byId("announcements");
const noTabStop = byId<HTMLInputElement>("no-tab-stop");
const noKeyboard = byId<HTMLInputElement>("no-keyboard");

// ---- The markup ------------------------------------------------------------
//
// The tree renders the WAI-ARIA tree view pattern:
//
//   ul[role=tree], named by aria-labelledby or aria-label
//     li[role=none] > div[role=none] > span[role=treeitem]
//       aria-level, aria-selected, aria-expanded (folders only),
//       tabindex: 0 on the tab stop, -1 on the other nodes
//     ul[role=group] for the children of a folder
//
// The `li` and `div` have role=none, so screen readers skip them and see the
// title span as the treeitem. A treeitem takes its name from its text: the
// node name.

const treeItems = (): HTMLElement[] => [
  ...element.querySelectorAll<HTMLElement>("[role=treeitem]"),
];

/** The treeitem of the folder that contains this treeitem, if any. */
function parentItem(item: HTMLElement): HTMLElement | null {
  const parentLi = item.closest("li")?.parentElement?.closest("li");

  return parentLi?.querySelector(":scope > div > [role=treeitem]") ?? null;
}

/**
 * Can a screen reader reach the item? The children of a closed folder can
 * still be in the DOM, but they are hidden.
 */
function isExposed(item: HTMLElement): boolean {
  for (let parent = parentItem(item); parent; parent = parentItem(parent)) {
    if (parent.getAttribute("aria-expanded") !== "true") {
      return false;
    }
  }

  return true;
}

// ---- Creating the tree -----------------------------------------------------

function createTree(state: null | SavedState): TreeElement {
  const tree = new TreeElement({
    autoOpen: 0,
    // A tree needs an accessible name. Point it at the heading above the
    // tree; use `ariaLabel` instead when there is no visible heading.
    ariaLabelledBy: "tree-heading",
    data: dinosaurs,
    htmlElement: element,
    // keyboardSupport and tabIndex are read in the constructor, so changing
    // them means recreating the tree.
    keyboardSupport: !noKeyboard.checked,
    tabIndex: noTabStop.checked ? -1 : 0,
  });

  if (state) {
    tree.setState(state);
  }

  return tree;
}

let tree = createTree(null);

function recreateTree(): void {
  const state = tree.getState();

  tree.deinit();
  tree = createTree(state);
}

for (const checkbox of [noTabStop, noKeyboard]) {
  checkbox.addEventListener("change", recreateTree);
}

// ---- Reduced motion --------------------------------------------------------
//
// When the user prefers reduced motion, `animationSpeed` defaults to 0: folders
// open and close without sliding. Setting `animationSpeed` yourself overrides
// that. The preference is read when the tree is created, so recreate the tree
// when it changes.

const motion = byId("motion");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function showMotion(): void {
  motion.textContent = reducedMotion.matches
    ? "Reduced motion is on, so folders open and close without animation."
    : "Folders slide open and closed. Turn on reduced motion in the system settings, or emulate prefers-reduced-motion in the browser's dev tools, and they open instantly.";
}

reducedMotion.addEventListener("change", () => {
  showMotion();
  recreateTree();
});

showMotion();

// ---- The focused node ------------------------------------------------------

const spoken = byId("spoken");
const attributes = byId<HTMLDListElement>("attributes");

const shownAttributes = [
  "role",
  "aria-level",
  "aria-expanded",
  "aria-selected",
  "tabindex",
];

/**
 * Roughly what a screen reader says for a treeitem. The position in the set
 * ("2 of 5") is not an attribute: screen readers count the siblings in the
 * group themselves.
 */
function describeItem(item: HTMLElement): string {
  const li = item.closest("li");
  const siblings = li?.parentElement ? [...li.parentElement.children] : [];
  const expanded = item.getAttribute("aria-expanded");

  return [
    item.textContent,
    "tree item",
    expanded === null ? null : expanded === "true" ? "expanded" : "collapsed",
    item.getAttribute("aria-selected") === "true" ? "selected" : null,
    li ? `${siblings.indexOf(li) + 1} of ${siblings.length}` : null,
    `level ${item.getAttribute("aria-level")}`,
  ]
    .filter(Boolean)
    .join(", ");
}

function showFocusedNode(): void {
  const item = document.activeElement;

  attributes.replaceChildren();

  if (!(item instanceof HTMLElement) || item.getAttribute("role") !== "treeitem") {
    spoken.textContent = element.contains(item)
      ? ""
      : "The focus is not on the tree.";
    return;
  }

  spoken.textContent = `“${describeItem(item)}”`;

  for (const name of shownAttributes) {
    const value = item.getAttribute(name);

    if (value !== null) {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = name;
      dd.textContent = value;
      attributes.append(dt, dd);
    }
  }
}

document.addEventListener("focusin", showFocusedNode);
document.addEventListener("focusout", () => {
  // activeElement is the body during focusout; wait for the new element.
  setTimeout(showFocusedNode);
});

// ---- The accessibility tree ------------------------------------------------

const outline = byId<HTMLPreElement>("outline");

function showOutline(): void {
  const lines = treeItems()
    .filter(isExposed)
    .map((item) => {
      const level = Number(item.getAttribute("aria-level"));
      const expanded = item.getAttribute("aria-expanded");
      const icon = expanded === null ? " " : expanded === "true" ? "▾" : "▸";

      const line = document.createElement("div");
      line.textContent = `${"  ".repeat(level - 1)}${icon} ${item.textContent}`;
      line.classList.toggle("selected", item.getAttribute("aria-selected") === "true");

      if (item.getAttribute("tabindex") === "0") {
        const marker = document.createElement("span");
        marker.className = "marker";
        marker.textContent = "tab";
        line.append(" ", marker);
      }

      return line;
    });

  outline.replaceChildren(...lines);
}

// Everything the panels show comes from the DOM, so watch the DOM instead of
// the tree events. That also shows that the attributes are kept up to date.
new MutationObserver(() => {
  showOutline();
  showFocusedNode();
}).observe(element, {
  attributeFilter: ["aria-expanded", "aria-selected", "tabindex"],
  childList: true,
  subtree: true,
});

showOutline();

// ---- Keyboard --------------------------------------------------------------

const keyRows = document.querySelectorAll<HTMLTableRowElement>("tr[data-key]");

element.addEventListener("keydown", (event) => {
  for (const row of keyRows) {
    row.classList.toggle("pressed", row.dataset.key === event.key);
  }
});

element.addEventListener("keyup", () => {
  for (const row of keyRows) {
    row.classList.remove("pressed");
  }
});

// ---- Announcements ---------------------------------------------------------
//
// When the focus is on the tree, a screen reader reads the focused node, so
// keyboard navigation needs nothing extra. A change made from elsewhere, like
// a button that selects a node without moving the focus, is silent. Announce
// it in a live region: `role="log"` on the announcements element.

const isFocusOnTree = (): boolean => element.contains(document.activeElement);

const announce = (text: string): void => {
  if (!isFocusOnTree()) {
    appendLine(announcements, text);
  }
};

element.addEventListener("tree.select", (event) => {
  announce(`${event.detail.node.name} selected`);
});

element.addEventListener("tree.deselect", (event) => {
  announce(`${event.detail.node.name} deselected`);
});

element.addEventListener("tree.open", (event) => {
  announce(`${event.detail.node.name} expanded`);
});

element.addEventListener("tree.close", (event) => {
  announce(`${event.detail.node.name} collapsed`);
});

// ---- Form fields -----------------------------------------------------------
//
// The tree listens to keydown on the document, but only handles a key when the
// focus is on one of its nodes. Keys in the fields above the tree do what they
// normally do. Enter in the text field would submit the form; keep the page.

byId<HTMLFormElement>("fields").addEventListener("submit", (event) => {
  event.preventDefault();
});

// ---- Opening a node --------------------------------------------------------
//
// Enter dispatches `tree.activate` for the selected node, or for the focused
// node when nothing is selected. It is the keyboard version of clicking a
// link: open the edit page of the node, for example. The focus stays on the
// tree, so the details element is a live region (`aria-live="polite"`) to
// have a screen reader read what was opened.

const details = byId("details");

element.addEventListener("tree.activate", (event) => {
  const { node } = event.detail;

  const name = document.createElement("strong");
  name.textContent = node.name;

  // `note` is an extra key in the node data, typed as `unknown`.
  details.replaceChildren(
    name,
    typeof node.note === "string" ? ` — ${node.note}` : "",
  );
});

// ---- From code -------------------------------------------------------------

const tyrannosauroids = () => tree.getNodeById(9);

byId("select-quiet").addEventListener("click", () => {
  const node = tyrannosauroids();

  if (node) {
    // selectNode opens the parents. mustToggle: false keeps a second click
    // from deselecting the node.
    tree.selectNode(node, { mustSetFocus: false, mustToggle: false });
  }
});

byId("select-focus").addEventListener("click", () => {
  const node = tyrannosauroids();

  if (node) {
    tree.selectNode(node, { mustToggle: false });
  }
});

byId("focus-tree").addEventListener("click", () => {
  // The tab stop is the selected node, or the first node. With tabIndex: -1
  // there is no tab stop, but the selected node can still take the focus.
  const target =
    element.querySelector<HTMLElement>("[role=treeitem][aria-selected=true]") ??
    treeItems()[0];

  target?.focus();
});

byId("deselect").addEventListener("click", () => {
  const node = tree.getSelectedNode();

  if (node) {
    tree.selectNode(null);
    announce(`${node.name} deselected`);
  }
});
