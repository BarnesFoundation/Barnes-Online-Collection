module.exports.register = function(Handlebars) {
    Handlebars.registerHelper('urlify', function(string) {
        if (!string) return '';
        return string.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    });
};