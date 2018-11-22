import $ from 'jquery';
import {parseCode, recursiveHandle, htmlBuild} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let parsedString = recursiveHandle(parsedCode);
        parsedString = htmlBuild(parsedString);
        $('#parsedCode').html(parsedString);
    });
});
