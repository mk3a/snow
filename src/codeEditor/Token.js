"use strict";
var $ = require('jquery');
var validKinds = require('./validTokenKinds.js');
class Token {
	constructor(lexeme, kind, category, cssClasses = []) {
		console.assert(validKinds.includes(kind));
		this.lexeme = lexeme;
		this.kind = kind;
		this.category = category;
		this.classes = cssClasses;
	}
	addClass(className) {
		this.classes.push(className)
	}
	getLexeme() {
		return this.lexeme;
	}
	getKind() {
		return this.kind;
	}
	getCategory() {
		return this.category;
	}
	getClassesString() {
		return this.classes.join(" ");
	}
	isNewLine() {
		return this.getKind() === "NEWLINE";
	}
	getHtmlRenderedElement() {
		var htmlElementAttrs = {
			class: this.getClassesString(),
			text: this.getLexeme()
		};
		switch (this.getKind()) {
			case 'TAB':
				this.addClass("tab");
				htmlElementAttrs.class = this.getClassesString();
				htmlElementAttrs.text = "    " //Currently tab equlas 4 spaces. Will implement json property file to read preferences later.
				break;
			case 'NEWLINE':
				console.error("NEWLINE token should not be rendered.");
				break;
			case 'SPACES':
				this.addClass("space");
				htmlElementAttrs.class = this.getClassesString();
				break;
			case 'BLANK':
				htmlElementAttrs.html = "<br>";
				break;
		}
		var htmlRenderedToken = $('<span></span>', htmlElementAttrs);
		return htmlRenderedToken;
	}
}

module.exports = Token;
