(function(window, document) {
    var baseUrl = 'https://chrome.google.com/webstore/detail/';

    function htmlEscape(str) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&#34;',
            "'": '&#39;'
        };

        return ('' + str).replace(/[&<>"']/g, function(match) {
            return map[match];
        });
    }

    chrome.management.getAll(function(result) {
        var html = '';
        var comment = '';
        var enabled = [];
        var disabled = [];

        // Get list of extensions
        for (var i = 0, len = result.length; i < len; i++) {
            if (result[i].enabled) {
                enabled.push({
                    name: result[i].name,
                    id: result[i].id,
                    description: result[i].description
                });
            }
            else {
                disabled.push({
                    name: result[i].name,
                    id: result[i].id,
                    description: result[i].description
                });
            }
        }

        // Sort by name
        enabled.sort(function(a, b) {
            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        });

        disabled.sort(function(a, b) {
            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        });


        html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Extensions</title><style>body, h2, ol, li {padding: 0;margin: 0;font: inherit}* {box-sizing: border-box}body {padding: 30px;font: 16px droid sans, segoe ui, ubuntu, sans-serif}h2 {margin-bottom: 5px;font-size: 20px;font-weight: bold}h2.enabled, ol.enabled a {color: #1b5e20}h2.disabled, ol.disabled a {color: #b71c1c}ol + h2 {margin-top: 30px}li {margin: 0 0 5px 30px}a {text-decoration: none}a:hover {text-decoration: underline}</style></head><body>';

        addExtensions(enabled, 'Enabled', 'enabled');
        addExtensions(disabled, 'Disabled', 'disabled');

        html += '</body></html>';
        html += '\n\n<!--\n' + comment.trim() + '\n-->\n';

        function addExtensions(arr, title, className) {
            var len = arr.length;

            if (!len) {
                return;
            }

            comment += '------------------------------------------------------\n';
            comment += '                     ' + title + '\n';
            comment += '------------------------------------------------------\n\n';

            var name;
            var url;
            var description;

            html += '<h2 class="' + className + '">' + title + '</h2>';
            html += '<ol class="' + className + '">';

            for (var i = 0; i < len; i++) {
                name = arr[i].name;
                url = baseUrl + arr[i].id;
                description = arr[i].description;

                html += '<li><a href="' + url + '" target="_blank" ';
                html += 'title="' + htmlEscape(description) + '">';
                html += htmlEscape(name) + '</a></li>';

                comment += name + '\n';
                comment += url + '\n\n';
            }

            html += '</ol>';
            comment += '\n\n\n';
        }

        // Download file
        var file = new Blob([html]);
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(file);
        a.download = 'extensions.html';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
})(window, document);
