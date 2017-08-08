module.exports.register = function(Handlebars) {
    Handlebars.registerHelper('capitalize', function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
};