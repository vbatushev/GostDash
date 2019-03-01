/*
 * @Author: Vitaly Batushev
 * @Date: 2019-03-01 14:39:26
 * @Last Modified by: Vitaly Batushev
 * @Last Modified time: 2019-03-01 15:14:48
 */

 var GostDash = (function(){
    var markers = ["ГОСТ", "ТУ", "ТР", "ТС", "EN"], // Список маркеров
        searchDash = "-",       // Grep искомого текста
        replaceDash = "~_";     // Grep заменяемого текста

    function main() {
        var isAllDoc = testPublication();
        if (isAllDoc) { // Если нужно обработать всю публикацию
            for (var i = 0, l = app.activeDocument.stories.length; i < l; i++) {
                processMarkers(app.activeDocument.stories.item(i));
            }
        } else { // Если работаем с конкретной Story
            processMarkers(app.selection[0].parentStory);
        }
        alert("Обработка завершена!");
    }

    /**
     * Обработка маркеров
     * @param {Story} story Обрабатываемая Story
     */
    var processMarkers = function(story) {
        for (var i = 0, l = markers.length; i < l; i++) {
            processMarker(markers[i], story);
        }
    }

    /**
     * Обработка конкретного маркера
     * @param {String} marker Текст маркера
     * @param {Story} story Обрабатываемая Story
     */
    var processMarker = function(marker, story) {
        clearGrepPreferences();
        app.findGrepPreferences.findWhat = "^" + marker + ".*";
        var matches = app.findGrep();
        for (var i = 0, l = matches.length; i < l; i++) processMatch(matches[i]);
    }

    /**
     * Обработка найденного текст
     * @param {Object} match
     */
    var processMatch = function (match) {
        clearGrepPreferences();
        app.findGrepPreferences.findWhat = searchDash;
        app.changeGrepPreferences.changeTo = replaceDash;
        match.changeGrep();
        clearGrepPreferences();
    }

    /**
     * Очистка настроек GREP
     */
    function clearGrepPreferences() { app.findGrepPreferences = null; app.changeGrepPreferences = null; }

    /**
     * Проверка публикации на возможность выполнения скрипта
     * При невозможности скрипт сообщает о причине отказа
     */
    var testPublication = function() {
        if (app.documents.length < 1) { alert("Нет открытых публикаций!\nОткрой публикацию и попробуйте снова.", "Ошибка", true); exit(); }
        if (app.selection.length < 1 || !app.selection[0].hasOwnProperty("parentStory")) return true;
        return false;
    }

    return { run: main }
 })();
app.doScript("GostDash.run();", ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "GOST Dash");