
// 获得地图服务的 json 信息
const MAP_SERVICE_JSON_CACHE = {}
export const getMapServiceJSONDetails = (url, options) => {
  const match = MAP_SERVICE_JSON_CACHE[url]
  options = Object.assign({}, {
    cache: true,
    validate: true
  }, options)
  const promise = (options.cache && match)
    ? Promise.resolve(match)
    : fetch(`${url}?f=pjson`)
        .catch(e => { throw new Error('无法获取地图服务信息') })
        .then(r => r.json())
        .catch(e => { throw new Error('地图服务信息解析出错') })

  return promise.then(r => {
    if (options.validate) {
      const errorMessage = validateMapService(r)
      if (errorMessage) {
        throw new Error(errorMessage)
      }
    }
    return MAP_SERVICE_JSON_CACHE[url] = r
  }).catch(e => {
    MAP_SERVICE_JSON_CACHE[url] = null
    throw e
  })
}


// 自动判断图层类型
export const getMapServiceLayerType
  = json => !!json.tileInfo ? MAP_LAYER_TYPES.TILED.value : MAP_LAYER_TYPES.DYNAMIC.value

export const isValidWkid = wkid => VALID_WKIDS.includes(wkid)

// create dynamic layer or tiled layer by mapServer Url
// layer: { type, mapServerUrl, visibility }
export const createLayerFromServerUrl = constructorMapping => ({ id, type, mapServerUrl }) => {
  const { DynamicMapServiceLayer, TiledMapServiceLayer } = constructorMapping
  const DynamicLayerConstructor =
    type === MAP_LAYER_TYPES.DYNAMIC.value
    ? DynamicMapServiceLayer
    : TiledMapServiceLayer

  const dynamicLayer = new DynamicLayerConstructor(mapServerUrl, { id })
  return dynamicLayer
}