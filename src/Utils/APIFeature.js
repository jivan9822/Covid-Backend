class APIFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    let Obj = { ...this.queryStr };
    ['sort', 'page', 'limit', 'fields'].map((el) => delete Obj[el]);
    Obj = JSON.parse(
      JSON.stringify(Obj).replace(
        /\b(gt)|(gte)|(lt)|(lte)|(eq)|(ne)\b/g,
        (match) => `$${match}`
      )
    );
    ['fname', 'lname'].map((el) => {
      if (Obj[el]) {
        Obj[el] = new RegExp(`^${Obj[el]}`, 'i');
      }
    });
    this.query = this.query.find(Obj);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort);
    }
    return this;
  }

  pagination() {
    if (this.queryStr.page) {
      const page = this.queryStr.page * 1 || 1;
      const limit = this.queryStr.limit * 1 || 2;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      this.query = this.query.select(this.queryStr.fields.split(',').join(' '));
    }
    return this;
  }
}

module.exports = APIFeature;
