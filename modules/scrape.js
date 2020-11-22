const axios = require('axios');
const path = require('path');
const fs = require('fs');

const errors = require('./errors');

const getDatasetURLFor = type =>
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/'
  .concat('csse_covid_19_data/csse_covid_19_time_series/time_series')
  .concat(`_covid19_${type}_global.csv`);

const getAxiosRequestOptionsFor = url => ({
  method: 'get', url, responseType: 'stream', timeout: 15000
})

const pathToCache = path.join(__dirname, '..', 'cache');

const downloadAndCacheDataset = async type => {
  const url = getDatasetURLFor(type);
  const response = await axios(getAxiosRequestOptionsFor(url))
    .catch(error => ({ error }));
  if (response.error) throw errors.networkRequestFailed();

  const filePath = path.join(pathToCache, `${type}.csv`);
  const writeStream = fs.createWriteStream(filePath);
  return new Promise((resolve, reject) => {
    response.data.pipe(writeStream);
    writeStream.on('error', error => reject(error));
    writeStream.on('close', () => resolve(null));
  });
}

module.exports = () => {
  const promises = [ 'confirmed', 'deaths', 'recovered' ]
    .map(type => downloadAndCacheDataset(type));
  return Promise.all(promises);
}
