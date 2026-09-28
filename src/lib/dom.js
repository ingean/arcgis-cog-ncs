export const SELECTORS = Object.freeze({
  MAP: '#map-component',
  NAVIGATION_LOGO: 'calcite-navigation-logo',
  NAVIGATION_USER: 'calcite-navigation-user',
  LOADER: 'calcite-loader',
  ASSISTANT: 'arcgis-assistant',
  ALERT_CONTAINER: '#alert-container',
  START_ACTION_BAR: '#start-action-bar',
  END_ACTION_BAR: '#end-action-bar'
})

export function qs(selector, root = document) {
  const el = root.querySelector(selector)
  if (!el) throw new Error(`dom.qs: no element found for selector "${selector}"`)
  return el
}

export function qsOptional(selector, root = document) {
  return root.querySelector(selector)
}
