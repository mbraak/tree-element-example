# tree-element example

A small Vite project showing how to use
[tree-element](https://github.com/mbraak/tree-element), a tree widget in plain
javascript: loading data, events, the api, drag and drop, loading on demand,
saving state, styling and accessibility.

Documentation for tree-element: <https://mbraak.github.io/tree-element/>

See it running: <https://mbraak.github.io/tree-element-example/>

## Run it

```sh
npm install
npm run dev
```

Then open <http://localhost:5173/>.

| Page                   | What it shows                                                                                                                                                                                                                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                    | A tree from an array, the events it dispatches, and the methods that change it. Right-click a node for a menu.                                                                                                                                                                                                                    |
| `/drag-and-drop.html`  | `dragAndDrop`, restricting moves with `onCanMove` and `onCanMoveTo`, and confirming a move before it is applied with `tree.move` and `doMove`                                                                                                                                                                                     |
| `/load-on-demand.html` | Fetching the top level from a url and each folder when it is opened, a loading indicator drawn from `aria-busy`, and a folder and a request that fail                                                                                                                                                                             |
| `/save-state.html`     | `saveState`: the open and selected nodes survive a reload. `getState` and `setState`                                                                                                                                                                                                                                              |
| `/styling.html`        | Custom folder icons, extra markup per node with `onCreateLi`, colors from css custom properties with a dark theme, css overrides, `rtl` and `buttonLeft`                                                                                                                                                                          |
| `/accessibility.html`  | The aria roles and states the tree renders, naming the tree with `ariaLabelledBy`, the single tab stop, keyboard navigation, opening a node with `Enter`, form fields that keep their own keys, `tabIndex` and `keyboardSupport`, no animation when the user prefers reduced motion, and a live region for changes made from code |

`npm run check` type-checks the project. `npm run build` writes a static build to
`dist/`, and `npm run preview` serves it. The build uses relative urls, so it
works from any path. Pushing to `master` deploys it to GitHub Pages, see
`.github/workflows/deploy.yml`.

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

| Request                   | Response                                                        |
| ------------------------- | --------------------------------------------------------------- |
| `GET api/nodes.json`      | The top-level nodes, with `load_on_demand: true` on the folders |
| `GET api/nodes/<id>.json` | The children of that node, or a 404 for an unknown id           |

In `npm run dev` and `npm run preview` the responses are delayed by 400 ms so
the loading indicator is visible. The build also writes every response to
`dist/api/`, so a static host such as GitHub Pages serves the same data; there
the requests are not delayed.

## Trying the source of tree-element

To run the examples against a local checkout of tree-element instead of the
npm package, point the dependency at it and reinstall:

```sh
npm install ../tree-element
```
