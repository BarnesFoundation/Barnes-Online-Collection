module.exports.register = function(Handlebars) {
    Handlebars.registerHelper('notequal', function(lvalue, rvalue, options) {
      if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
      if( lvalue!=rvalue ) {
          return options.fn(this);
      } else {
          return options.inverse(this);
      }
  });
};


