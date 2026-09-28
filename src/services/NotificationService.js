import Alert, { KINDS } from '../components/Alert.js'

export function notify(params) {
  return new Alert(params)
}

export const notifyError = (title, message, extra = {}) =>
  new Alert({ ...extra, kind: KINDS.DANGER, title, message })

export const notifyWarning = (title, message, extra = {}) =>
  new Alert({ ...extra, kind: KINDS.WARNING, title, message })

export const notifyInfo = (title, message, extra = {}) =>
  new Alert({ ...extra, kind: KINDS.INFO, title, message })

export const notifySuccess = (title, message, extra = {}) =>
  new Alert({ ...extra, kind: KINDS.SUCCESS, title, message })
