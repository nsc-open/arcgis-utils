
export const isValidToken = (mapServerUrl = '', token = '') => {
  const url = addUrlQuery(mapServerUrl, { f: 'pjson', token }, { keepQuery: false })
  return fetch(url).then(r => r.json())
    .then(r => !r.error)
    .catch(e => false)
}

/**
 * 判断地图服务是否需要授权
 * @param {String} mapServerUrl 
 */
export const isPrivateMapService = (mapServerUrl = '') => {
  return fetch(addPJson(mapServerUrl, { keepQuery: false })).then(r => r.json()).then(r => {
    return !!(r.error && r.error.code === 499) // r.error.message === 'Token Required'
  }).catch(() => false)
}