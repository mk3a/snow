"use strict";
var Token = require("./Token.js");
var $ = require('jquery');
var splitLineIntoTokens = string => {
	function hasOnlySpaces(string) {
		if (string == '') return false
		for (let ch of string) {
			if (ch != ' ') return false
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
var formattingPipelineStages = {
	splitStringIntoLines: string => string.split('\n'),

	/*Temporary Tokenizer to get newline rendering to work.*/
	splitLineIntoTokens: string => {
		function hasOnlySpaces(string) {
			if (string == '') return false
			for (let ch of string) {
				if (ch != ' ') return false
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
	},
	splitEachLineIntoTokens: lines => lines.map(line => this.splitLineIntoTokens(line)),

	renderTokensIntoHTMLElements: tokens => tokens.map(token => token.getHtmlRenderedElement()),
	renderEachLineTokensIntoHTMLElements: linesOfTokens => linesOfTokens.map(lineOfTokens => this.renderTokensIntoHTMLElements(lineOfTokens)),

	concatenateHTMLElements: elements => elements.reduce((accumulator, currentElem) => accumulator.add(currentElem), $()),
	concatenateEachLineIntoHTMLElement: lines => lines.map(htmlElems => this.concatenateHTMLElements(htmlElems)),

	surroundHTMLElemWithDiv: element => $('<div></div>').append(element),
	surroundEachHTMLElemWithDiv: elements => elements.map(element => this.surroundHTMLElemWithDiv(element)),

	createPipeline: function () {
		return [this.splitStringIntoLines, this.splitEachLineIntoTokens, this.renderEachLineTokensIntoHTMLElements,
			this.concatenateEachLineIntoHTMLElement, this.surroundEachHTMLElemWithDiv, this.concatenateHTMLElements
		];
	}
}

var formattingPipeline = {

}

module.exports = formattingPipelineStages;
