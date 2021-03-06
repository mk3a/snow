"use strict";
var Token = require("./Token.js");
var $ = require('jquery');
var formattingPipelineStages = {
	/*Temporary Tokenizer to get newline rendering to work.*/
	splitStringIntoTokens: string => string.split(' ').map(lexeme => new Token(lexeme, ["blue"])),

	renderTokensIntoHTMLElements: tokens => tokens.map(token => token.getHtmlRenderedElement()),

	concatenateHTMLElements: elements => elements.reduce((accumulator, currentElem) => accumulator.add(currentElem), $()),

	createPipeline: () => [splitStringIntoTokens, renderTokensIntoHTMLElements, concatenateHTMLElements]
}
module.exports = formattingPipelineStages;
