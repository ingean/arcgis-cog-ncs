export function appendChildren(el, children) {
  if (children == null) return el
  if (Array.isArray(children)) {
    el.append(...children)
  } else {
    el.append(children)
  }
  return el
}

export function element(tagName, attributes, children) {
  const el = document.createElement(tagName || 'div')
  if (attributes) {
    for (const name in attributes) {
      el.setAttribute(name, attributes[name])
    }
  }
  return appendChildren(el, children)
}

export const div = (attributes, children) => element('div', attributes, children)
