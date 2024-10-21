
export function elementAsString(element: any, prepend?: string): string {
  if ((typeof element) === "object") {

    if (Array.isArray(element)) {
      return (element as string[]).map((it) => {
        return JSON.stringify(it);
      }).join(', ')

    } else {
      let str = ""
      if (typeof prepend !== 'undefined') {
        str += "<br/>"
      } else {
        prepend = ""
      }
      return str + Object.keys(element).map((it) => {
        return prepend + "&nbsp;&nbsp;" + it + ": " + elementAsString(element[it], "&nbsp;&nbsp;").toString()
      }).join("<br/>");
    }

  } else {
    return element.toString();
  }
}
