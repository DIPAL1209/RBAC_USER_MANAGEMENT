exports.applySearch = (query, queryString, fields = []) => {
  if (queryString.search && fields.length) {
    query = query.find({
      $or: fields.map(field => ({
        [field]: { $regex: queryString.search, $options: "i" }
      }))
    });
  }
  return query;
};

exports.applySort = (query, queryString) => {
  if (queryString.sort) {
    query = query.sort(queryString.sort.split(",").join(" "));
  } else {
    query = query.sort("-createdAt");
  }
  return query;
};

exports.applyPagination = (query, queryString) => {
  const page = parseInt(queryString.page) || 1;
  const limit = parseInt(queryString.limit) || 5;
  const skip = (page - 1) * limit;

  return {
    query: query.skip(skip).limit(limit),
    page,
    limit,
  };
};
