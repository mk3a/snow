"use strict";
var $ = require('jquery');
var Token = require("./Token.js");
var Pipeline = require("./Pipeline.js");
var lexer = require("./lexer.js");
/*
Beginnning of SingleLine Pipeline functions
*/
// var splitLineIntoTokens = string => {
// 	function hasOnlySpaces(string) {
// 		if (string == '') return false;
// 		for (let ch of string) {
// 			if (ch != ' ') return false;
// 		}
// 		return true;
// 	}

// 	function generateTokenOutOfLexeme(lexeme) {
// 		if (hasOnlySpaces(lexeme)) return new Token(lexeme, "SPACES");
// 		else if (lexeme === '\t') return new Token(lexeme, "TAB");
// 		else if (lexeme === '') return new Token(lexeme, "BLANK");
// 		else return new Token(lexeme, "REGULAR", ["blue"]);
// 	}
// 	var tokens = string.split(',').map(lexeme => generateTokenOutOfLexeme(lexeme));
// 	return tokens;
// };
Array.prototype.flatMap = function (lambda) {
	return Array.prototype.concat.apply([], this.map(lambda));
};
var splitStringIntoTokens = inputString => {
	var blankToken = new Token("", "BLANK");
	if (inputString === "") return [blankToken];
	else return lexer.generateTokens(inputString);
};
var splitMultiLineComments = tokens => tokens.flatMap(token => {
	if (token.getKind() === "MULTI_LINE_COMMENT") {
		var splitStrings = token.getLexeme().match(/(.+)|\n/g);
		return splitStrings.map(string => {
			if (string === "\n") return new Token("\n", "NEWLINE", "WHITESPACE");
			else return new Token(string, "MULTI_LINE_COMMENT", "COMMENT");
		});
	}
	else {
		return [token];
	}
});
//Categorys can then be styled in CSS. This allows full styling flexibility in css which is good practice.
var addStyleToTokens = tokens => tokens.map(token => {
	token.addClass(token.getCategory());
	token.addClass(token.getKind());
	return token;
});
var addBlankTokens = tokens => {
	var blankToken = new Token("", "BLANK");
	var tokensWithBlanks = []; //Inserts Blank tokens between \n \n to facilitate rendering.
	tokens.forEach(token => {
		if (tokensWithBlanks.length > 0 && tokensWithBlanks[tokensWithBlanks.length - 1].isNewLine() && token.isNewLine()) {
			tokensWithBlanks.push(blankToken);
		}
		tokensWithBlanks.push(token);
	});
	if (tokensWithBlanks[tokensWithBlanks.length - 1].isNewLine()) tokensWithBlanks.push(blankToken);
	if (tokensWithBlanks[0].isNewLine()) tokensWithBlanks.unshift(blankToken);
	return tokensWithBlanks;
};
var splitAtNewLine = tokens => {
	var tokenLines = []; //Ex: [[INT_TOKEN,IDENTIFIER_TOKEN AND OTHER FIRST LINE TOKENS],[NEXT LINE TOKENS]];
	var tokenLine = [];
	tokens.forEach(token => {
		if (token.isNewLine()) {
			tokenLines.push(tokenLine);
			tokenLine = [];
		}
		else {
			tokenLine.push(token);
		}
	});
	tokenLines.push(tokenLine);
	return tokenLines;
};

var renderTokensIntoHTMLElements = tokens => tokens.map(token => token.getHtmlRenderedElement());

var concatenateHTMLElements = elements => elements.reduce((accumulator, currentElem) => accumulator.add(currentElem), $());

var surroundHTMLElemWithDiv = element => $('<div></div>').append(element);

var formatLinePipeline = new Pipeline([addStyleToTokens, renderTokensIntoHTMLElements, concatenateHTMLElements, surroundHTMLElemWithDiv]);

/*
Beginning of Multiple Line Pipeline functions
*/
var renderLinesIntoHTMLDivs = lines => lines.map(line => formatLinePipeline.passValThrough(line));
var formatLinesPipeline = new Pipeline([splitStringIntoTokens, splitMultiLineComments, addBlankTokens, splitAtNewLine,
	renderLinesIntoHTMLDivs, concatenateHTMLElements]);

module.exports = {
	codeFormatter: formatLinesPipeline
}
