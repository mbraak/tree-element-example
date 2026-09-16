# tree-element example

A small Vite project showing how to use
[tree-element](https://github.com/mbraak/tree-element), a tree widget in plain
javascript: loading data, events, the api, drag and drop, loading on demand,
saving state and styling.

Documentation for tree-element: <https://mbraak.github.io/tree-element/>

## Run it

```sh
npm install
npm run dev
```

Then open <http://localhost:5173/>.

| Page                    | What it shows                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `/`                     | A tree from an array, the events it dispatches, and the methods that change it. Right-click a node for a menu. |
| `/drag-and-drop.html`   | `dragAndDrop`, restricting moves with `onCanMove` and `onCanMoveTo`, and confirming a move before it is applied with `tree.move` and `doMove` |
| `/load-on-demand.html`  | Fetching the top level from a url and each folder when it is opened, with a loading indicator and a failing request |
| `/save-state.html`      | `saveState`: the open and selected nodes survive a reload. `getState` and `setState`                       |
| `/styling.html`         | Custom folder icons, extra markup per node with `onCreateLi`, css overrides, `rtl` and `buttonLeft`        |

`npm run check` type-checks the project. `npm run build` writes a static build to
`dist/`, and `npm run preview` serves it.

## Where to look

```
index.html, *.html        one page per topic, sharing a header
src/pages/*.ts            the script of each page: this is the example code
src/data.ts               the nodes, plus the helpers the fake api uses
src/eventLog.ts           listens for tree events and prints them
src/style.css             page chrome and the loading indicator
src/pages/styling.css     overrides for tree_element.css
vite.config.ts            the pages, and the fake /api/nodes endpoint
```

Each page script imports the widget and its stylesheet like any project that
installs the package would:

```ts
import TreeElement from "tree-element";
import "tree-element/tree_element.css";
```

### The fake api

The load-on-demand page needs a server that answers the tree's requests. A
small Vite plugin in `vite.config.ts` stands in for it:

| Request                    | Response                                                       |
| -------------------------- | -------------------------------------------------------------- |
| `GET /api/nodes`           | The top-level nodes, with `load_on_demand: true` on the folders |
| `GET /api/nodes?node=<id>` | The children of that node, or a 404 for an unknown id          |

The responses are delayed by 400 ms so the loading indicator is visible. The
plugin runs in `npm run dev` and `npm run preview`; a static `dist/` on its own
has no api, so that page will show a failed load there.

## Trying the source of tree-element

To run the examples against a local checkout of tree-element instead of the
npm package, point the dependency at it and reinstall:

```sh
npm install ../tree-element
```
