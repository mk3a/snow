var regexBlocks = new Map([
  ["O", "[0-7]"],
  ["D", "[0-9]"],
  ["NZ", "[1-9]"],
  ["L", "[a-zA-Z_]"],
  ["A", "[a-zA-Z_0-9]"],
  ["H", "[a-fA-F0-9]"],
  ["HP", "(0[xX])"],
  ["E", "([Ee][+-]?{D}+)"],
  ["P", "([Pp][+-]?{D}+)"],
  ["FS", "(f|F|l|L)"],
  ["IS", "(((u|U)(l|L|ll|LL)?)|((l|L|ll|LL)(u|U)?))"],
  ["CP", "(u|U|L)"],
  ["SP", "(u8|u|U|L)"],
  ["ES", '(\\([\'\"\?\\abfnrtv]|[0-7]{1,3}|x[a-fA-F0-9]+))'],
  ["WS", '" "\t\v\n\f]']
]);

var Tokenizer = {

}
//Ex: Replaces {D}+ with [0-9]+
function replaceRegexBlobs(patternString) {
  var regexBlobs = new Map([
    ["D", "[0-9]"],
    ["L", "[a-zA-Z_]"],
    ["H", "[a-fA-F0-9]"],
    ["E", "[Ee][+-]?[0-9]+"],
    ["P", "[Pp][+-]?[0-9]+"],
    ["FS", "(f|F|l|L)"],
    ["IS", "((u|U)|(u|U)?(l|L|ll|LL)|(l|L|ll|LL)(u|U))"]
  ]);
  for (var [key, value] of regexBlobs) {
    var regex = new RegExp("{" + key + "}", "g");
    patternString = patternString.replace(regex, value);
  }
  return patternString;
}

function getFirstRegexMatch(patternString, input) {
  var regexPattern = new RegExp("^" + patternString);
  var matches = input.match(regexPattern);
  // console.assert(matches.length <= 1);
  if (matches == null) return null;
  else return matches[0];
}

function generateComment(input) {
  var token = null;
  if (input.startsWith("/*")) {
    var commentEndIndex = input.search(/\*\//g);
    var multiLinecomment = (commentEndIndex >= 0) ? input.substring(0, commentEndIndex + 2) : input;
    token = new Token(multiLinecomment, "COMMENT");
    return token;
  }
  else if (getFirstRegexMatch("\/\/[^\n]*", input)) {
    var singleLineComment = getFirstRegexMatch("\/\/[^\n]*", input);
    token = new Token(singleLineComment, "COMMENT");
    return token;
  }
  else {
    throw ("Unable to generate Comment from beginning of input.");
  }
}

function generateKeywords(input) {
  var keyWordToKind = new Map([
    ["auto", "AUTO"],
    ["_Bool", "BOOL"],
    ["break", "BREAK"],
    ["case", "CASE"],
    ["char", "CHAR"],
    ["_Complex", "COMPLEX"],
    ["const", "CONST"],
    ["continue", "CONTINUE"],
    ["default", "DEFAULT"],
    ["do", "DO"],
    ["double", "DOUBLE"],
    ["else", "ELSE"],
    ["enum", "ENUM"],
    ["extern", "EXTERN"],
    ["float", "FLOAT"],
    ["for", "FOR"],
    ["goto", "GOTO"],
    ["if", "IF"],
    ["_Imaginary", "IMAGINARY"],
    ["inline", "INLINE"],
    ["int", "INT"],
    ["long", "LONG"],
    ["register", "REGISTER"],
    ["restrict", "RESTRICT"],
    ["return", "RETURN"],
    ["short", "SHORT"],
    ["signed", "SIGNED"],
    ["sizeof", "SIZEOF"],
    ["static", "STATIC"],
    ["struct", "STRUCT"],
    ["switch", "SWITCH"],
    ["typedef", "TYPEDEF"],
    ["union", "UNION"],
    ["unsigned", "UNSIGNED"],
    ["void", "VOID"],
    ["volatile", "VOLATILE"],
    ["while", "WHILE"]
  ]);
  var token = null;
  for (var [key, value] of keyWordToKind) {
    if (input.startsWith(key)) {
      token = new Token(key, value);
      break;
    }
  }
  if (token) return token;
  else throw ("Unable to generate keywords out of input.");
}

function generateIdentifier(input) {
  var identifierRegex = replaceRegexBlobs("{L}({L}|{D})*");
  var match = getFirstRegexMatch(identifierRegex, input);
  if (match) {
    return new Token(match, "IDENTIFIER");
  }
  else {
    throw ("Unable to generate identifier out of input.");
  }
}

//TODO : make tryEach return an array of tokens and pick largest in generateSingleToken
function tryEach(functions, input) {
  for (let [index, fnct] of functions.entries()) {
    try {
      var returnValue = fnct(input);
      return returnValue;
    }
    catch (ex) {
      console.log(ex);
      if (index == (functions.length - 1)) throw ("None of the functions succeeded");
    }
  }
}

function generateSingleToken(input) {
  try {
    return tryEach([generateComment, generateKeywords, generateIdentifier], input);
  }
  catch (ex) {
    console.log(ex);
  }
}

function consumeSingleToken(token, input) {
  var beginningLexeme = token.getLexeme();
  //Cut off the lexeme and return the remaining part
  if (beginningLexeme === input.substring(0, beginningLexeme.length)) {
    return input.substring(beginningLexeme.length);
  }
  else {
    console.log("Unable to consume token.");
    return input;
  }
}