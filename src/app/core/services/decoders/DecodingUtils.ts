export function elementAsString(element: any, prepend?: string): string {
  if (typeof element === 'object') {
    return JSON.stringify(element);
  } else {
    return element.toString();
  }
}
