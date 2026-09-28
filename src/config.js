const config = Object.freeze({
  appId: 'w8MteBiiYAwXiNdn', // OAuth2 App ID
  mapItemId: 'ed9c982d0d4d4dcf8415d3c46e20c4c7', // ArcGIS Online Web Map Item ID
  suggestedPrompts: Object.freeze([
    'Gå til Porsgrunn.',
    'Hva er ICAO koden til Oslo Lufthavn?'
  ])
})

export function validateConfig(c) {
  if (!c?.appId || typeof c.appId !== 'string') {
    throw new Error('config.appId is required and must be a non-empty string')
  }
  if (!c.mapItemId || typeof c.mapItemId !== 'string') {
    throw new Error('config.mapItemId is required and must be a non-empty string')
  }
  if (!Array.isArray(c.suggestedPrompts)) {
    throw new Error('config.suggestedPrompts must be an array')
  }
}

export default config
