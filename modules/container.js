const errors = require('./errors');

const filter = (dates, figures, target, flag = false) => {
  const callback = flag ? (item, index) => index >= target : 
    (item, index) => index < target;
  const filteredFigures = figures.filter(callback);
  const filteredDates = dates.filter(callback);
  return [ filteredDates, filteredFigures ];
}

class DataContainer{
  from (mm, dd, yy){
    const date = [ mm, dd, yy ].join('/').toString();
    const target = this.dates.indexOf(date);
    if (target === -1) throw errors.givenDateOutOfBounds(date);
    const postFiltering = filter(this.dates, this.figures, target, true);
    return new DataContainer(...postFiltering);
  }

  to (mm, dd, yy){
    const date = [ mm, dd, yy ].join('/').toString();
    const target = this.dates.indexOf(date);
    if (target === -1) throw errors.givenDateOutOfBounds(date);
    const postFiltering = filter(this.dates, this.figures, target);
    return new DataContainer(...postFiltering);
  }
  
  at (mm, dd, yy){
    const date = [ mm, dd, yy].join('/').toString();
    const target = this.dates.indexOf(date);
    if (target === -1) throw errors.givenDateOutOfBounds(date);
    const postFiltering = [ this.dates[target], this.figures[target] ];
    return new DataContainer(...postFiltering);
  }
  
  get(){
    const figures = this.figures;
    const dates = this.dates;
    return { dates, figures };
  }

  constructor(dates, figures){
    this.figures = figures;
    this.dates = dates;
  }
}

module.exports = DataContainer;
