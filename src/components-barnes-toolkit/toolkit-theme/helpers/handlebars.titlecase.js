module.exports.register = function(Handlebars) {
    Handlebars.registerHelper('titlecase', function(str) {
      if (typeof str === 'undefined') return '';

      str = str.replace(/_/g, ' ');
      str = str.split(' ')
               .map(i => i[0].toUpperCase() + i.substr(1))
               .join(' ');

      return str;
    });
};