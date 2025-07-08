class BlogSearch {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete queryObj[el]);

    const filter = { ...queryObj };
    if (queryObj.tags || queryObj.author || queryObj.title) {
      //filter by Tags
      if (queryObj.tags) {
        const tagList = queryObj.tags.split(",");
        const tagsArray = tagList.map((tag) => ({
          tags: { $regex: tag, $options: "i" },
        }));
        filter.$or = tagsArray;
        delete filter.tags;
      }

      //Filter by author
      if (queryObj.author) {
        filter.author = { $regex: queryObj.author, $options: "i" };
      }

      //Filter by title
      if (queryObj.title) {
        filter.title = { $regex: queryObj.title, $options: "i" };
      }
    }
    this.query = this.query.find(filter);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt -updatedAt -_id");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 3;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = BlogSearch;
