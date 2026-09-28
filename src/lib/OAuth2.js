const Portal = await $arcgis.import('@arcgis/core/portal/Portal.js')
const OAuthInfo = await $arcgis.import('@arcgis/core/identity/OAuthInfo.js')
const esriId = await $arcgis.import('@arcgis/core/identity/IdentityManager.js')

export async function authenticate(appId) {
  const info = new OAuthInfo({
    appId,
    flowType: 'auto',
    popup: false
  })
  esriId.registerOAuthInfos([info])

  const sharingUrl = info.portalUrl + '/sharing'
  const signIn = () => esriId.getCredential(sharingUrl)
  const signOut = () => {
    esriId.destroyCredentials()
    window.location.reload()
  }

  let portal = null
  let userInfo = null

  try {
    await esriId.checkSignInStatus(sharingUrl)
    portal = new Portal()
    portal.authMode = 'immediate'
    await portal.load()
    const { thumbnailUrl, fullName, username } = portal.user ?? {}
    userInfo = { thumbnailUrl, fullName, username }
  } catch (err) {
    if (!isNotSignedInError(err)) throw err
    // Not signed in: trigger the OAuth redirect; userInfo stays null.
    signIn()
  }

  return { portal, userInfo, signIn, signOut }
}

function isNotSignedInError(err) {
  // ArcGIS IdentityManager rejects with `identity-manager:not-authenticated`
  // when there is no active session. Treat anything else as a real failure.
  return err?.name === 'identity-manager:not-authenticated'
    || err?.message === 'User is not signed in.'
    || err?.details?.error === 'identity-manager:not-authenticated'
}
