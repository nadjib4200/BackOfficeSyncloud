// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(CodeMirror) {
    "use strict";

    var WORD = /[\w$]+/, RANGE = 500;

    CodeMirror.registerHelper("hint", "algolia", function(editor, options) {
      var cm = editor;
      var word = WORD;
      var range = RANGE;

      
      var cur = cm.getCursor();
      var curLine = editor.getLine(cur.line);
      var start = cur.ch, end = start;
      while (end < curLine.length && word.test(curLine.charAt(end))) ++end;
      while (start && word.test(curLine.charAt(start - 1))) --start;
      var curWord = start != end && curLine.slice(start, end);
             
      return {list: options.list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};

    })

})(CodeMirror);


