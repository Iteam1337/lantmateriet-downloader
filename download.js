const https = require('https')
const fs = require('fs')
const path = require('path')
const { from, concatMap, mergeMap, tap, take, map, startWith, mergeAll, filter } = require('rxjs')
const AdmZip = require('adm-zip')
const { header, parse, toCsv } = require('./xml2csv')
const urls = fs.readFileSync('urls.txt').toString().split('\n')

const downloadFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filename)) return resolve(filename)
    const file = fs.createWriteStream(filename)
    // 50012665_200001_2511.belagenhetsadress.0117.zip
    https.get(url, (response) => {
      response.pipe(file)
    })
    file.on('finish', () => {
      file.close()
      resolve(filename)
    })
    file.on('error', (err) => {
      reject(err)
    })
  })
}

const unzip = (filename) => {
  return new Promise((resolve, reject) => {
    const zip = new AdmZip(filename)
    zip.extractAllTo('xml', true)
    resolve(filename.replace('.zip', '.xml').replace('download/', 'xml/'))
  })
}

const downloadUrls = (urls) =>
  from(urls).pipe(
    //take(2),
    concatMap(url => downloadFile(url, path.join('download', url.split('/').pop()))),
    mergeMap(unzip),
    map(parse),
    mergeAll(),
    filter(f => f.gata),
    map(toCsv),
    startWith(header()),
  )

module.exports = {
  downloadUrls
}