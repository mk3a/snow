"use strict";
var $ = require('jquery');
var Token = require("./Token.js");
var Pipeline = require("./Pipeline.js");

/*
Beginnning of SingleLine Pipeline functions
*/
var splitLineIntoTokens = string => {
	function hasOnlySpaces(string) {
		if (string == '') return false;
		for (let ch of string) {
			if (ch != ' ') return false;
		}
		return true;
	}

	function generateTokenOutOfLexeme(lexeme) {
		if (hasOnlySpaces(lexeme)) return new Token(lexeme, "SPACES");
		else if (lexeme === '\t') return new Token(lexeme, "TAB");
		else if (lexeme === '') return new Token(lexeme, "BLANK");
		else return new Token(lexeme, "REGULAR", ["blue"]);
	}
	var tokens = string.split(',').map(lexeme => generateTokenOutOfLexeme(lexeme));
	return tokens;
};

var renderTokensIntoHTMLElements = tokens => tokens.map(token => token.getHtmlRenderedElement());

var concatenateHTMLElements = elements => elements.reduce((accumulator, currentElem) => accumulator.add(currentElem), $());

var surroundHTMLElemWithDiv = element => $('<div></div>').append(element);

var formatLinePipeline = new Pipeline([splitLineIntoTokens, renderTokensIntoHTMLElements, concatenateHTMLElements, surroundHTMLElemWithDiv]);

/*
Beginning of Multiple Line Pipeline functions
*/
var splitStringIntoLines = string => string.split('\n');
var renderLinesIntoHTMLDivs = lines => lines.map(line => formatLinePipeline.passValThrough(line));
var formatLinesPipeline = new Pipeline([splitStringIntoLines, renderLinesIntoHTMLDivs, concatenateHTMLElements]);

module.exports = formatLinesPipeline;