export const parseFilters = (filters) => {
  const parsedFilters = filters.map((filter) => {
    const hasValue = typeof filter.value !== 'undefined';

    // for lines and colors we just use the name
    // for space and light we use the value
    const value = hasValue ? filter.value : filter.name
    let ret = {};
    ret[filter.filterType] = value;
    return ret;
  });

  return JSON.stringify(parsedFilters);
}
