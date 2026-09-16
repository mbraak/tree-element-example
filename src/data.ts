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
      { name: "Herrerasaurians", id: 2, note: "early predators" },
      {
        name: "Theropods",
        id: 3,
        note: "mostly carnivores",
        children: [
          { name: "Coelophysoids", id: 4, note: "slender early theropods" },
          { name: "Ceratosaurians", id: 5, note: "horned skulls" },
          { name: "Spinosauroids", id: 6, note: "crocodile-like snouts" },
          { name: "Carnosaurians", id: 7, note: "large predators" },
          {
            name: "Coelurosaurians",
            id: 8,
            note: "feathered",
            children: [
              { name: "Tyrannosauroids", id: 9, note: "includes T. rex" },
              { name: "Ornithomimosaurians", id: 10, note: "ostrich-like" },
              { name: "Therizinosauroids", id: 11, note: "huge claws" },
              { name: "Oviraptorosaurians", id: 12, note: "toothless beaks" },
              { name: "Dromaeosaurids", id: 13, note: "raptors" },
              { name: "Troodontids", id: 14, note: "large brains" },
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
          { name: "Prosauropods", id: 17, note: "early long-necks" },
          {
            name: "Sauropods",
            id: 18,
            note: "giants",
            children: [
              { name: "Diplodocoids", id: 19, note: "whip-like tails" },
              {
                name: "Macronarians",
                id: 20,
                note: "large nostrils",
                children: [
                  { name: "Brachiosaurids", id: 21, note: "giraffe-like" },
                  {
                    name: "Titanosaurians",
                    id: 22,
                    note: "largest land animals",
                  },
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
      { name: "Heterodontosaurids", id: 24, note: "varied teeth" },
      {
        name: "Thyreophorans",
        id: 25,
        note: "armoured",
        children: [
          { name: "Ankylosaurians", id: 26, note: "club tails" },
          { name: "Stegosaurians", id: 27, note: "back plates" },
        ],
      },
      {
        name: "Ornithopods",
        id: 28,
        note: "bipedal herbivores",
        children: [{ name: "Hadrosaurids", id: 29, note: "duck-billed" }],
      },
      { name: "Pachycephalosaurians", id: 30, note: "dome-headed" },
      { name: "Ceratopsians", id: 31, note: "horned faces" },
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
