const DataContainer = require('./modules/container');
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

exports.getBoundingDatesForDataset = async () => {
  const response = await init.then(() => ({ error: null }))
    .catch(error => ({ error }));
  if (response.error) throw response.error;

  const dates = datasets['deaths'].dates;
  return { start: dates[0], end: dates[dates.length - 1] };
}

exports.getCountryDataFromDataset = async (country, type, region = '') => {
  const response = await init.then(() => ({ error: null }))
    .catch(error => ({ error }));
  if (response.error) throw response.error;

  const validType = [ 'confirmed', 'recovered', 'deaths' ]
    .indexOf(type) > -1;
  if (!validType) throw errors.incorrectDatasetType(type);
  const countryData = datasets[type].countries[country];
  if (!countryData) throw errors.givenCountryNotFound(country, type);

  if (countryData.regions && region === '')
    throw errors.regionNotSpecified(country);
  if (countryData.regions && !countryData.regions[region])
    throw errors.regionNotFound(country, region);

  const figures = region ? countryData.regions[region] : countryData;
  const dates = datasets[type].dates;
  return new DataContainer(dates, figures);
}