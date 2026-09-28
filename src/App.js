import PanelManager from './components/PanelManager.js'
import { authenticate } from './lib/OAuth2.js'
import { qs, SELECTORS } from './lib/dom.js'
import { validateConfig } from './config.js'
import { notifyError } from './services/NotificationService.js'

export default class App {
  #config
  #portal = null
  #signOut = null

  constructor(config) {
    validateConfig(config)
    this.#config = config
  }

  async start() {
    try {
      await this.#authenticate()
    } catch (err) {
      console.error('Authentication failed:', err)
      notifyError('Innlogging feilet', err?.message ?? 'Kunne ikke kontakte ArcGIS-tjenesten.')
      return
    }
    this.#initMap()
    this.#initPanels()
    this.#wirePortalItem()
  }

  async #authenticate() {
    const { portal, userInfo, signIn, signOut } = await authenticate(this.#config.appId)
    this.#portal = portal
    this.#signOut = signOut

    const userElement = qs(SELECTORS.NAVIGATION_USER)
    if (userInfo) {
      userElement.thumbnail = userInfo.thumbnailUrl ?? ''
      userElement.fullName = userInfo.fullName ?? ''
      userElement.username = userInfo.username ?? ''
      userElement.addEventListener('click', signOut)
    } else {
      userElement.addEventListener('click', signIn)
    }
  }

  #initMap() {
    const mapElement = qs(SELECTORS.MAP)
    mapElement.itemId = this.#config.mapItemId
  }

  #initPanels() {
    new PanelManager(SELECTORS.START_ACTION_BAR, { defaultActiveId: 'layers' })
    new PanelManager(SELECTORS.END_ACTION_BAR)
  }

  #wirePortalItem() {
    const mapElement = qs(SELECTORS.MAP)
    mapElement.addEventListener('arcgisViewReadyChange', (event) => {
      const { portalItem } = event.target.map
      const navigationLogo = qs(SELECTORS.NAVIGATION_LOGO)
      navigationLogo.heading = portalItem.title
      navigationLogo.description = portalItem.snippet
      navigationLogo.thumbnail = portalItem.thumbnailUrl
      navigationLogo.href = portalItem.itemPageUrl
      navigationLogo.label = 'Miniatyrbilde av kartet'

      const assistantElement = qs(SELECTORS.ASSISTANT)
      assistantElement.suggestedPrompts = this.#config.suggestedPrompts
      qs(SELECTORS.LOADER).hidden = true
    })
  }
}
