import queryString from 'query-string'

export const setUrlQuery = (url = '', query = {}) => {
  return `${removeUrlQuery(url)}?${queryString.stringify(query)}`
}

export const addUrlQuery = (url = '', query = {}) => {
  const result = queryString.parseUrl(url)
  result.query = {
    ...result.query,
    ...query
  }
  return `${result.url}?${queryString.stringify(result.query)}`
}

export const removeUrlQuery = (url = '') => {
  return queryString.parseUrl(url).url
}