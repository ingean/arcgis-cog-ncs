import { qs } from '../lib/dom.js'

export default class PanelManager {
  #activeId = null
  #pairs = new Map() // id -> { action, panel }
  #orphanActions = new Set() // actions without a panel (e.g. external links)

  constructor(actionBarSelector, { defaultActiveId = null } = {}) {
    const actionBar = typeof actionBarSelector === 'string'
      ? qs(actionBarSelector)
      : actionBarSelector
    if (!actionBar) {
      throw new Error(`PanelManager: action bar not found for ${actionBarSelector}`)
    }

    const shellPanel = actionBar.closest('calcite-shell-panel')
    if (!shellPanel) {
      throw new Error('PanelManager: action bar must be inside a calcite-shell-panel')
    }

    const actions = actionBar.querySelectorAll('[data-action-id]')
    for (const action of actions) {
      const id = action.dataset.actionId
      const panel = shellPanel.querySelector(`[data-panel-id="${id}"]`)
      if (panel) {
        this.#pairs.set(id, { action, panel })
      } else {
        this.#orphanActions.add(id)
      }
    }

    actionBar.addEventListener('click', this.#handleClick)

    if (defaultActiveId) this.activate(defaultActiveId)
  }

  get activeId() {
    return this.#activeId
  }

  activate(id) {
    if (!this.#pairs.has(id)) return
    if (this.#activeId && this.#activeId !== id) this.#setVisible(this.#activeId, false)
    this.#setVisible(id, true)
    this.#activeId = id
  }

  deactivate() {
    if (!this.#activeId) return
    this.#setVisible(this.#activeId, false)
    this.#activeId = null
  }

  toggle(id) {
    if (this.#activeId === id) {
      this.deactivate()
    } else {
      this.activate(id)
    }
  }

  #setVisible(id, visible) {
    const pair = this.#pairs.get(id)
    if (!pair) return
    pair.action.active = visible
    pair.panel.hidden = !visible
  }

  #handleClick = ({ target }) => {
    const action = target.closest('[data-action-id]')
    if (!action) return
    const id = action.dataset.actionId
    if (this.#orphanActions.has(id)) return // let the action handle itself
    this.toggle(id)
  }
}
