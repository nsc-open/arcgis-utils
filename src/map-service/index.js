import memoize from 'lodash.memoize'
import { MAP_SERVICE_LAYER_TYPES } from '../constants/index'
import { addUrlQuery, removeUrlQuery } from '../utils/url'

const _getMapServiceJson = (serverUrl = '') => {
  return fetch(
    addUrlQuery(serverUrl, { f: 'json' })
  ).then(r => r.json()).then(json => {
    if (json.error) {
      throw json.error
    } else {
      return json
    }
  })
}

const getMapServiceJsonWithCache = memoize(_getMapServiceJson)

/**
 * get the json object of a given mapServerUrl
 * if token is required, need to append to the mapServerUrl first
 * 
 * @param {String} serverUrl 
 * @return {Promise} jsonObject
 */
export const getMapServiceJson = (serverUrl, enableCache = true) => {
  if (enableCache) {
    return getMapServiceJsonWithCache(serverUrl)
  } else {
    return _getMapServiceJson(serverUrl)
  }
}

/**
 * check the mapService is layer of tiled or dynamic
 * 
 * @param {Object} mapServiceJson
 * @return {String} 'tiled'|'dynamic'
 */
export const getMapServiceLayerType = (mapServiceJson = {}) => {
  return !!mapServiceJson.tileInfo ? MAP_SERVICE_LAYER_TYPES.TILED : MAP_SERVICE_LAYER_TYPES.DYNAMIC
}

/**
 * check the given mapServerUrl is a private map service or not.
 * only if error with code 499 will be considered as private,
 * other errors will be throw directly,
 * if no errors, means it is a public map service
 * 
 * @param {String} mapServerUrl 
 */
export const isPrivateMapService = (mapServerUrl = '') => {
  return fetch(
    addUrlQuery(removeUrlQuery(mapServerUrl), { f: 'json' })
  ).then(r => r.json()).then(r => {
    if (r.error && r.error.code === 499) { // r.error = { code: 499, message: 'Token Required' }
      return true
    } else if (r.error) {
      throw r.error
    } else {
      return false
    }
  })
}

/**
 * add token in mapServerUrl as query
 * 
 * @param {String} mapServerUrl 
 * @param {String} token 
 */
export const addTokenInQuery = (mapServerUrl = '', token = '') => {
  return addUrlQuery(mapServerUrl, { token })
}

/**
 * check if the token is valid to authorize the given map serivce server url
 * 
 * @param {String} mapServerUrl 
 * @param {String} token 
 */
export const isValidToken = (mapServerUrl = '', token = '') => {
  return fetch(
    addUrlQuery(mapServerUrl, { f: 'json', token })
  ).then(r => r.json()).then(r => !r.error)
}
