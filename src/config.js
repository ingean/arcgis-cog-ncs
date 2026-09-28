const COG_BASE_URL = 'https://ts001.blob.core.windows.net/ncs-data/results/ucB_egnethet_tif'

const config = Object.freeze({
  appId: 'w8MteBiiYAwXiNdn', // OAuth2 App ID
  mapItemId: 'ed9c982d0d4d4dcf8415d3c46e20c4c7', // ArcGIS Online Web Map Item ID
  // Cloud Optimized GeoTIFF parts from a Spark/Databricks output directory (CORS-enabled Azure Blob).
  // The container doesn't allow anonymous listing, so the part filenames are fixed here; re-run
  // `az storage blob list --account-name ts001 --container-name ncs-data --prefix results/ucB_egnethet_tif/`
  // and update this list if the pipeline produces a new set of files.
  cogLayerUrls: Object.freeze([
    `${COG_BASE_URL}/part-00000-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2058-1-c000.tif`,
    `${COG_BASE_URL}/part-00001-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2059-1-c000.tif`,
    `${COG_BASE_URL}/part-00002-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2060-1-c000.tif`,
    `${COG_BASE_URL}/part-00003-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2061-1-c000.tif`,
    `${COG_BASE_URL}/part-00004-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2062-1-c000.tif`,
    `${COG_BASE_URL}/part-00005-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2063-1-c000.tif`,
    `${COG_BASE_URL}/part-00006-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2064-1-c000.tif`,
    `${COG_BASE_URL}/part-00007-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2065-1-c000.tif`,
    `${COG_BASE_URL}/part-00008-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2066-1-c000.tif`,
    `${COG_BASE_URL}/part-00010-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2068-1-c000.tif`,
    `${COG_BASE_URL}/part-00012-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2070-1-c000.tif`,
    `${COG_BASE_URL}/part-00013-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2071-1-c000.tif`,
    `${COG_BASE_URL}/part-00014-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2072-1-c000.tif`,
    `${COG_BASE_URL}/part-00016-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2074-1-c000.tif`,
    `${COG_BASE_URL}/part-00017-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2075-1-c000.tif`,
    `${COG_BASE_URL}/part-00018-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2076-1-c000.tif`,
    `${COG_BASE_URL}/part-00019-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2077-1-c000.tif`,
    `${COG_BASE_URL}/part-00020-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2078-1-c000.tif`,
    `${COG_BASE_URL}/part-00021-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2079-1-c000.tif`,
    `${COG_BASE_URL}/part-00022-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2080-1-c000.tif`,
    `${COG_BASE_URL}/part-00023-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2081-1-c000.tif`,
    `${COG_BASE_URL}/part-00024-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2082-1-c000.tif`,
    `${COG_BASE_URL}/part-00025-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2083-1-c000.tif`,
    `${COG_BASE_URL}/part-00027-tid-3727753728307642782-983aaf2a-1069-42c9-9471-4d38ed65284d-2085-1-c000.tif`
  ]),
  cogLayerTitle: 'Egnethet',
  // Pixel value -> category for the classified suitability raster. Drives both the
  // map renderer (CogLayer.js) and the legend text shown in the "Tegnforklaring" panel.
  cogLayerClasses: Object.freeze([
    Object.freeze({ value: 0, label: 'Ekskludert (rør/felt/CO₂)', color: [158, 158, 158] }),
    Object.freeze({ value: 1, label: 'Mulig, lavere vind', color: [254, 224, 139] }),
    Object.freeze({ value: 2, label: 'Flytende – høy vind', color: [69, 117, 180] }),
    Object.freeze({ value: 3, label: 'Bunnfast – høy vind', color: [26, 152, 80] })
  ]),
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
  if (!Array.isArray(c.cogLayerUrls) || c.cogLayerUrls.length === 0 || !c.cogLayerUrls.every((url) => typeof url === 'string' && url.length > 0)) {
    throw new Error('config.cogLayerUrls is required and must be a non-empty array of non-empty strings')
  }
  if (c.cogLayerTitle != null && typeof c.cogLayerTitle !== 'string') {
    throw new Error('config.cogLayerTitle must be a string when provided')
  }
  if (!Array.isArray(c.cogLayerClasses) || c.cogLayerClasses.length === 0 ||
    !c.cogLayerClasses.every((cls) => typeof cls?.value === 'number' && typeof cls?.label === 'string' && Array.isArray(cls?.color))) {
    throw new Error('config.cogLayerClasses is required and must be an array of { value, label, color }')
  }
  if (!Array.isArray(c.suggestedPrompts)) {
    throw new Error('config.suggestedPrompts must be an array')
  }
}

export default config
