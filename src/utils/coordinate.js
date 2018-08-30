
//经纬度转墨卡托
export const lonlat2mercator = lonlat => {
  const mercator = { x: 0, y: 0 }
  let x = lonlat.x * 20037508.34 / 180
  let y = Math.log(Math.tan((90 + lonlat.y) * Math.PI / 360)) / (Math.PI / 180)
  y = y * 20037508.34 / 180
  mercator.x = x
  mercator.y = y
  return mercator
}

//墨卡托转经纬度
export const mercator2lonlat = mercator => {
  const lonlat = { x: 0, y: 0 }
  let x = mercator.x / 20037508.34 * 180
  let y = mercator.y / 20037508.34 * 180
  y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2)
  lonlat.x = x
  lonlat.y = y
  return lonlat
}