A17.Helpers.purgeProperties = function(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      delete obj[prop];
    }
  }
};
