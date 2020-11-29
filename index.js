const errors = require('./modules/errors');
const scrape = require('./modules/scrape');
const parse = require('./modules/parse');

const path = require('path');
const fs = require('fs');

const pathToCache = path.join(__dirname, 'cache');
const datasets = {};

const getDatasetOfType = type => 
  require(path.join(pathToCache, `${type}.json`));

const refresh = async () => {
  const response = await scrape().then(() => parse())
    .then(() => ({ error: null })).catch(error => ({ error }));
  if (response.error) throw response.error;

  datasets.confirmed = getDatasetOfType('confirmed');
  datasets.recovered = getDatasetOfType('recovered');
  datasets.deaths = getDatasetOfType('deaths');
}

const init = (async () => {
  const exists = await fs.promises.access(pathToCache)
    .then(() => true).catch(() => false);
  if (!exists)
    await fs.promises.mkdir(pathToCache);
  const response = await refresh()
    .then(() => ({ error: null })).catch(error => ({ error }));
  if (response.error) 
    throw errors.datasetInitializationFailed();
})();

exports.getCountriesInDataset = async () => {
  const response = await init.then(() => ({ error: null }))
    .catch(error => ({ error }));
  if (response.error) throw response.error;

  const dataset = datasets['deaths'].countries;
  return Object.keys(dataset).map(country => ({
    country, regions:(dataset[country].regions !== undefined)
  }));
}