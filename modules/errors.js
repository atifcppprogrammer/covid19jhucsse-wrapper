exports.networkRequestFailed = () => {
  const message = 'Network request intending to collect dataset '
          .concat('from JHU-CSSE\'s GitHub repository failed !');
  return new Error(message);
}

exports.datasetInitializationFailed = () => {
  const message = 'JHU-CSSE Dataset initialization failed owing '
          .concat('to network error !');
  return new Error(message);
}

exports.incorrectDatasetType = givenType => {
  const message = `Given dataset type ${givenType} is invalid the `
	  .concat('specified dataset type must be one of ')
          .concat('[ confirmed, recovered, deaths ]');
  return new Error(message);
}

exports.givenDateOutOfBounds = () => {
  const message = 'Specified date is outside of the dataset\'s bounding '
	  .concat('dates use getBoundingDates() function to view these ')
	  .concat('dates');
  return new Error(message);
}

exports.givenCountryNotFound = (givenCountry, givenType) => {
  const message = `No country with name ${givenCountry} found in dataset `
          .concat(`of type ${givenType}, use getCountriesInDataset() to `)
          .concat('view all countries in dataset.');
  return new Error(message);
}

exports.regionNotSpecified = givenCountry => {
  const message = `Specification of region for ${givenCountry} is required `
          .concat(`since data for ${givenCountry} is organized by region`);
  return new Error(message);
}

exports.regionNotFound = (givenCountry, givenRegion) => {
  const message = `No region with name ${givenRegion} found for `
          .concat(`country ${givenCountry}`);
  return new Error(message);
}