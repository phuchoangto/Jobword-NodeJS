function paginate(totalRecords, limit, page) {
    const pageCount = Math.ceil(totalRecords / limit);
    if (page < 1) page = 1;
    if (page > pageCount) page = pageCount;
    let offset = (page - 1) * limit;
    return { page, limit, pageCount, totalRecords, offset };
}

module.exports = paginate;