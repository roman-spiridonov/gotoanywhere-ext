$(function () {
    var data = JSON.parse(localStorage.getItem('db'));

    $('#search').select2({
        placeholder: "Type action to search...",
        allowClear: true,
        data: data,
        escapeMarkup: function (markup) {  // disable removing mark-up
            return markup;
        },
        templateResult: function (item) {  // return item markup in options list (expanded)
            var tmpl = _.template(document.getElementById('option-template').innerHTML, {'variable': 'item'});
            return tmpl(item);
        },
        templateSelection: function (item) {  // return selected item markup (collapsed)
            return item.selectedText;
        }
    });

    $('#search').on('select2:select', function (e) {
        console.log("selected tab", e.params.data.tab);
        chrome.tabs.update(e.params.data.tab.id, {active: true});
    });

    $('#search').select2('open');

});
