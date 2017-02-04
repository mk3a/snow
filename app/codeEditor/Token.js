"use strict";
var $ = require('jquery');
class Token {

	constructor(lexeme, cssClasses = []) {
		this.lexeme = lexeme;
		this.classes = cssClasses;
	}
	addClass(className) {
		this.classes.push(className)
	}
	getLexeme() {
		return this.lexeme;
	}
	getClassesString() {
		return this.classes.join(" ");
	}
	getHtmlRenderedElement() {
		var htmlElementAttrs = {
			class: this.getClassesString(),
			text: this.getLexeme()
		}
		var htmlRenderedToken = $('<span></span>', htmlElementAttrs);
		return htmlRenderedToken;
	}
}

module.exports = Token;
