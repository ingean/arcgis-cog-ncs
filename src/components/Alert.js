import { element, div } from '../lib/html.js'
import { qs, SELECTORS } from '../lib/dom.js'

export const KINDS = Object.freeze({
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger'
})

export const ICONS = Object.freeze({
  info: 'information',
  success: 'check-circle',
  warning: 'exclamation-mark-triangle',
  danger: 'exclamation-mark-circle'
})

export default class Alert {
  constructor({
    title,
    message,
    kind = KINDS.INFO,
    icon,
    placement = 'bottom-end',
    autoClose = true,
    containerSelector = SELECTORS.ALERT_CONTAINER
  } = {}) {
    if (typeof title !== 'string' || title.length === 0) {
      throw new Error('Alert: `title` is required and must be a non-empty string')
    }
    if (typeof message !== 'string' || message.length === 0) {
      throw new Error('Alert: `message` is required and must be a non-empty string')
    }

    const resolvedIcon = icon ?? ICONS[kind] ?? ICONS.info
    const container = qs(containerSelector)

    this.alert = element('calcite-alert', {
      kind,
      icon: resolvedIcon,
      placement,
      role: kind === KINDS.DANGER ? 'alert' : 'status'
    }, [
      div({ slot: 'title' }, title),
      div({ slot: 'message' }, message)
    ])

    container.appendChild(this.alert)
    this.alert.autoClose = autoClose
    this.alert.open = true

    this.alert.addEventListener('calciteAlertClose', () => this.alert.remove())
  }

  close() {
    this.alert.open = false
  }
}

export class ErrorAlert extends Alert {
  constructor(params = {}) {
    super({ ...params, kind: KINDS.DANGER })
  }
}

export class WarningAlert extends Alert {
  constructor(params = {}) {
    super({ ...params, kind: KINDS.WARNING })
  }
}

export class InfoAlert extends Alert {
  constructor(params = {}) {
    super({ ...params, kind: KINDS.INFO })
  }
}

export class ConfirmationAlert extends Alert {
  constructor(params = {}) {
    super({ ...params, kind: KINDS.SUCCESS })
  }
}
