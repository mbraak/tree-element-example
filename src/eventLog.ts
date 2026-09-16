import type { Node, TreeEventName, TreeEvents } from "tree-element";

/**
 * Logs tree events to an element. Every event is a `CustomEvent` dispatched on
 * the tree's element, with the payload in `event.detail`. The package augments
 * `HTMLElementEventMap`, so `addEventListener("tree.select", ...)` is typed.
 */
export function logEvents(
  element: HTMLElement,
  output: HTMLElement,
  names: TreeEventName[],
): void {
  for (const name of names) {
    element.addEventListener(name, (event) => {
      appendLine(output, `${name} ${describe(name, event.detail)}`);
    });
  }
}

export function appendLine(output: HTMLElement, text: string): void {
  const line = document.createElement("div");
  line.textContent = text;
  output.append(line);
  output.scrollTop = output.scrollHeight;
}

const nodeName = (node: Node | null | undefined): string =>
  node ? node.name : "(the tree)";

function describe(name: TreeEventName, detail: unknown): string {
  switch (name) {
    case "tree.click":
    case "tree.dblclick":
    case "tree.contextmenu":
    case "tree.open":
    case "tree.close":
    case "tree.deselect": {
      const { node } = detail as TreeEvents["tree.click"];
      return nodeName(node);
    }

    case "tree.select": {
      const { node, deselectedNode } = detail as TreeEvents["tree.select"];
      return deselectedNode
        ? `${node.name} (was ${deselectedNode.name})`
        : node.name;
    }

    case "tree.move": {
      const { moveInfo } = detail as TreeEvents["tree.move"];
      return `${moveInfo.movedNode.name} ${moveInfo.position} ${moveInfo.targetNode.name}`;
    }

    case "tree.set_data": {
      const { node, treeData } = detail as TreeEvents["tree.set_data"];
      return `${treeData?.length ?? 0} nodes into ${nodeName(node)}`;
    }

    case "tree.loading_data":
    case "tree.loaded_data": {
      const { node } = detail as TreeEvents["tree.loading_data"];
      return nodeName(node);
    }

    case "tree.load_failed": {
      const { response, error } = detail as TreeEvents["tree.load_failed"];
      return response ? `status ${response.status}` : String(error);
    }

    default:
      return "";
  }
}
