import type { NodeData } from "tree-element";

/**
 * The nodes of the example tree. `name`, `id` and `children` are what
 * tree-element uses; `note` is an extra property that is copied onto the
 * `Node` objects and read back on the styling page.
 */
export type ExampleNode = {
  children?: ExampleNode[];
  id: number;
  name: string;
  note?: string;
};

export const dinosaurs: ExampleNode[] = [
  {
    name: "Saurischia",
    id: 1,
    note: "lizard-hipped",
    children: [
      { name: "Herrerasaurians", id: 2 },
      {
        name: "Theropods",
        id: 3,
        note: "mostly carnivores",
        children: [
          { name: "Coelophysoids", id: 4 },
          { name: "Ceratosaurians", id: 5 },
          { name: "Spinosauroids", id: 6 },
          { name: "Carnosaurians", id: 7 },
          {
            name: "Coelurosaurians",
            id: 8,
            children: [
              { name: "Tyrannosauroids", id: 9 },
              { name: "Ornithomimosaurians", id: 10 },
              { name: "Therizinosauroids", id: 11 },
              { name: "Oviraptorosaurians", id: 12 },
              { name: "Dromaeosaurids", id: 13 },
              { name: "Troodontids", id: 14 },
              { name: "Avialans", id: 15, note: "includes birds" },
            ],
          },
        ],
      },
      {
        name: "Sauropodomorphs",
        id: 16,
        note: "long necks",
        children: [
          { name: "Prosauropods", id: 17 },
          {
            name: "Sauropods",
            id: 18,
            children: [
              { name: "Diplodocoids", id: 19 },
              {
                name: "Macronarians",
                id: 20,
                children: [
                  { name: "Brachiosaurids", id: 21 },
                  { name: "Titanosaurians", id: 22 },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Ornithischians",
    id: 23,
    note: "bird-hipped",
    children: [
      { name: "Heterodontosaurids", id: 24 },
      {
        name: "Thyreophorans",
        id: 25,
        note: "armoured",
        children: [
          { name: "Ankylosaurians", id: 26 },
          { name: "Stegosaurians", id: 27 },
        ],
      },
      {
        name: "Ornithopods",
        id: 28,
        children: [{ name: "Hadrosaurids", id: 29 }],
      },
      { name: "Pachycephalosaurians", id: 30 },
      { name: "Ceratopsians", id: 31 },
    ],
  },
];

// ---- Helpers for the fake api in vite.config.ts ---------------------------

/** A node without its children, marked `load_on_demand` when it has some. */
const withoutChildren = ({ children, ...node }: ExampleNode): NodeData =>
  children ? { ...node, load_on_demand: true } : node;

/** The top level of the tree, as a server would send it. */
export const topLevel = (): NodeData[] => dinosaurs.map(withoutChildren);

/** The children of a node, or `null` when there is no such node. */
export function childrenOf(id: string): NodeData[] | null {
  const node = findNode(dinosaurs, Number(id));

  return node ? (node.children ?? []).map(withoutChildren) : null;
}

function findNode(nodes: ExampleNode[], id: number): ExampleNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }

    const found = node.children && findNode(node.children, id);

    if (found) {
      return found;
    }
  }

  return null;
}
