/** `document.getElementById` that throws instead of returning `null`. */
export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`There is no element with id "${id}"`);
  }

  return element as T;
}
