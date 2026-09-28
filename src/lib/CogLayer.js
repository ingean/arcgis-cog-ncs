const [ImageryTileLayer, GroupLayer, RasterColormapRenderer] = await $arcgis.import([
  '@arcgis/core/layers/ImageryTileLayer.js',
  '@arcgis/core/layers/GroupLayer.js',
  '@arcgis/core/renderers/RasterColormapRenderer.js'
])

// Builds a categorical renderer from { value, label, color } entries — drives both
// the map symbology and the "Tegnforklaring" legend text for a classified raster.
export function createClassifiedRenderer(classes) {
  return new RasterColormapRenderer({
    colormapInfos: classes.map(({ value, label, color }) => ({ value, label, color }))
  })
}

export async function createCogLayer({ url, title, renderer }) {
  // Each layer gets its own renderer instance — sharing one across layers risks cross-talk.
  const layer = new ImageryTileLayer({ url, title, renderer: renderer?.clone() })
  await layer.load()
  return layer
}

// Combines multiple COG part-files (e.g. a Spark/Databricks output directory)
// into a single GroupLayer so they act as one layer in the UI. A part failing
// to load doesn't block the others — callers can inspect `failed` to warn.
export async function createCogGroupLayer({ urls, title, renderer }) {
  const results = await Promise.allSettled(urls.map((url) => createCogLayer({ url, renderer })))

  const layers = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)
  const failed = results
    .filter((result) => result.status === 'rejected')
    .map((result) => result.reason)

  if (layers.length === 0) {
    throw new AggregateError(failed, `createCogGroupLayer: all ${urls.length} part(s) failed to load`)
  }

  const groupLayer = new GroupLayer({ title, visibilityMode: 'inherited', layers })
  return { groupLayer, failed }
}
