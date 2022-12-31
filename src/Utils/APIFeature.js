class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    let queryObj = { ...this.queryStr };
    ['sort', 'page', 'limit', 'fields'].map((el) => delete queryObj[el]);

    queryObj = JSON.parse(
      JSON.stringify(queryObj).replace(
        /\b(gt)|(gte)|(lt)|(lte)\b/g,
        (match) => `$${match}`
      )
    );

    if (queryObj.availableSizes) {
      queryObj.availableSizes = queryObj.availableSizes.toUpperCase();
    }

    ['fname', 'lname', 'title', 'description', 'brand', 'style', 'status'].map(
      (el) => {
        queryObj[el] && (queryObj[el] = new RegExp(`^${queryObj[el]}`, 'i'));
      }
    );

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort);
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      this.query = this.query.select(this.queryStr.fields.split(',').join(' '));
    }
    return this;
  }

  page() {
    if (this.queryStr.page) {
      const limit = this.queryStr.limit * 1 || 2;
      const page = this.queryStr.page * 1 || 1;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = APIFeatures;
