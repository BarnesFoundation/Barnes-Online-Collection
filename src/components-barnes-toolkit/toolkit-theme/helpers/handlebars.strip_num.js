module.exports.register = function(Handlebars) {
    Handlebars.registerHelper('strip_num', function(word) {
        var cleaned = word.replace(/^[0-9]_/, '');
        cleaned = cleaned.replace(/^_/, '');

        return cleaned;
    });
};