import type { NodeData } from "tree-element";

/**
 * The nodes of the example tree. `name`, `id` and `children` are what
 * tree-element uses; `note`, `period` and `wikipedia` are extra properties that
 * are copied onto the `Node` objects and read back on the styling page.
 */
export type ExampleNode = {
  children?: ExampleNode[];
  /** The geological period(s) the group lived in. Only on the leaf nodes. */
  period?: string;
  id: number;
  name: string;
  note?: string;
  /** The title of the Wikipedia article about the group. */
  wikipedia?: string;
};

export const dinosaurs: ExampleNode[] = [
  {
    name: "Saurischia",
    id: 1,
    note: "lizard-hipped",
    wikipedia: "Saurischia",
    children: [
      {
        name: "Herrerasaurians",
        id: 2,
        note: "early predators",
        wikipedia: "Herrerasauridae",
        period: "Triassic",
      },
      {
        name: "Theropods",
        id: 3,
        note: "mostly carnivores",
        wikipedia: "Theropoda",
        children: [
          {
            name: "Coelophysoids",
            id: 4,
            note: "slender early theropods",
            wikipedia: "Coelophysoidea",
            period: "Triassic–Jurassic",
          },
          {
            name: "Ceratosaurians",
            id: 5,
            note: "horned skulls",
            wikipedia: "Ceratosauria",
            period: "Jurassic–Cretaceous",
          },
          {
            name: "Spinosauroids",
            id: 6,
            note: "crocodile-like snouts",
            wikipedia: "Spinosauroidea",
            period: "Jurassic–Cretaceous",
          },
          {
            name: "Carnosaurians",
            id: 7,
            note: "large predators",
            wikipedia: "Carnosauria",
            period: "Jurassic–Cretaceous",
          },
          {
            name: "Coelurosaurians",
            id: 8,
            note: "feathered",
            wikipedia: "Coelurosauria",
            children: [
              {
                name: "Tyrannosauroids",
                id: 9,
                note: "includes T. rex",
                wikipedia: "Tyrannosauroidea",
                period: "Jurassic–Cretaceous",
              },
              {
                name: "Ornithomimosaurians",
                id: 10,
                note: "ostrich-like",
                wikipedia: "Ornithomimosauria",
                period: "Cretaceous",
              },
              {
                name: "Therizinosauroids",
                id: 11,
                note: "huge claws",
                wikipedia: "Therizinosauria",
                period: "Cretaceous",
              },
              {
                name: "Oviraptorosaurians",
                id: 12,
                note: "toothless beaks",
                wikipedia: "Oviraptorosauria",
                period: "Cretaceous",
              },
              {
                name: "Dromaeosaurids",
                id: 13,
                note: "raptors",
                wikipedia: "Dromaeosauridae",
                period: "Cretaceous",
              },
              {
                name: "Troodontids",
                id: 14,
                note: "large brains",
                wikipedia: "Troodontidae",
                period: "Cretaceous",
              },
              {
                name: "Avialans",
                id: 15,
                note: "includes birds",
                wikipedia: "Avialae",
                period: "Jurassic–today",
              },
            ],
          },
        ],
      },
      {
        name: "Sauropodomorphs",
        id: 16,
        note: "long necks",
        wikipedia: "Sauropodomorpha",
        children: [
          {
            name: "Prosauropods",
            id: 17,
            note: "early long-necks",
            wikipedia: "Prosauropoda",
            period: "Triassic–Jurassic",
          },
          {
            name: "Sauropods",
            id: 18,
            note: "giants",
            wikipedia: "Sauropoda",
            children: [
              {
                name: "Diplodocoids",
                id: 19,
                note: "whip-like tails",
                wikipedia: "Diplodocoidea",
                period: "Jurassic–Cretaceous",
              },
              {
                name: "Macronarians",
                id: 20,
                note: "large nostrils",
                wikipedia: "Macronaria",
                children: [
                  {
                    name: "Brachiosaurids",
                    id: 21,
                    note: "giraffe-like",
                    wikipedia: "Brachiosauridae",
                    period: "Jurassic–Cretaceous",
                  },
                  {
                    name: "Titanosaurians",
                    id: 22,
                    note: "largest land animals",
                    wikipedia: "Titanosauria",
                    period: "Cretaceous",
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
    wikipedia: "Ornithischia",
    children: [
      {
        name: "Heterodontosaurids",
        id: 24,
        note: "varied teeth",
        wikipedia: "Heterodontosauridae",
        period: "Triassic–Cretaceous",
      },
      {
        name: "Thyreophorans",
        id: 25,
        note: "armoured",
        wikipedia: "Thyreophora",
        children: [
          {
            name: "Ankylosaurians",
            id: 26,
            note: "club tails",
            wikipedia: "Ankylosauria",
            period: "Jurassic–Cretaceous",
          },
          {
            name: "Stegosaurians",
            id: 27,
            note: "back plates",
            wikipedia: "Stegosauria",
            period: "Jurassic–Cretaceous",
          },
        ],
      },
      {
        name: "Ornithopods",
        id: 28,
        note: "bipedal herbivores",
        wikipedia: "Ornithopoda",
        children: [
          {
            name: "Hadrosaurids",
            id: 29,
            note: "duck-billed",
            wikipedia: "Hadrosauridae",
            period: "Cretaceous",
          },
        ],
      },
      {
        name: "Pachycephalosaurians",
        id: 30,
        note: "dome-headed",
        wikipedia: "Pachycephalosauria",
        period: "Cretaceous",
      },
      {
        name: "Ceratopsians",
        id: 31,
        note: "horned faces",
        wikipedia: "Ceratopsia",
        period: "Jurassic–Cretaceous",
      },
    ],
  },
];

// ---- Helpers for the fake api in vite.config.ts ---------------------------

/** A node without its children, marked `load_on_demand` when it has some. */
const withoutChildren = ({ children, ...node }: ExampleNode): NodeData =>
  children ? { ...node, load_on_demand: true } : node;

/**
 * A folder whose children fail to load: it is not in `dinosaurs`, so the api
 * answers 404 for it. Shows what the tree does when loading fails.
 */
const failingFolder: NodeData = {
  id: 99,
  load_on_demand: true,
  name: "Fails to load",
};

/** The top level of the tree, as a server would send it. */
export const topLevel = (): NodeData[] => [
  ...dinosaurs.map(withoutChildren),
  failingFolder,
];

/** The children of a node, or `null` when there is no such node. */
export function childrenOf(id: string): NodeData[] | null {
  const node = findNode(dinosaurs, Number(id));

  return node ? (node.children ?? []).map(withoutChildren) : null;
}

/** The ids of all nodes in `dinosaurs`. */
export function nodeIds(nodes: ExampleNode[] = dinosaurs): number[] {
  return nodes.flatMap((node) => [node.id, ...nodeIds(node.children ?? [])]);
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
