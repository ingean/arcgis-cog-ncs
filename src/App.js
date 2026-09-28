import PanelManager from './components/PanelManager.js'
import { authenticate } from './lib/OAuth2.js'
import { createCogGroupLayer, createClassifiedRenderer } from './lib/CogLayer.js'
import { qs, SELECTORS } from './lib/dom.js'
import { validateConfig } from './config.js'
import { notifyError, notifyWarning } from './services/NotificationService.js'

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

      this.#addCogLayer(event.target.map)
    })
  }

  async #addCogLayer(map) {
    const { cogLayerUrls, cogLayerTitle, cogLayerClasses } = this.#config
    try {
      const renderer = createClassifiedRenderer(cogLayerClasses)
      const { groupLayer, failed } = await createCogGroupLayer({ urls: cogLayerUrls, title: cogLayerTitle, renderer })
      map.add(groupLayer)
      if (failed.length > 0) {
        failed.forEach((err) => console.error('Failed to load COG part:', err))
        notifyWarning('Enkelte kartlagsdeler mangler', `${failed.length} av ${cogLayerUrls.length} deler av "${cogLayerTitle}" kunne ikke lastes.`)
      }
    } catch (err) {
      console.error('Failed to load COG layer:', err)
      notifyWarning('Kunne ikke laste kartlag', 'Cloud Optimized GeoTIFF-laget kunne ikke lastes. Sjekk URL-ene og CORS-konfigurasjonen i Azure.')
    }
  }
}
