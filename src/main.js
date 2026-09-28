import App from './App.js'
import config from './config.js'
import { notifyError } from './services/NotificationService.js'

try {
  await new App(config).start()
} catch (err) {
  console.error('Fatal startup error:', err)
  notifyError('Oppstartsfeil', err?.message ?? 'Applikasjonen kunne ikke starte.')
}
