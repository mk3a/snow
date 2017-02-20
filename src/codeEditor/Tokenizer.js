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

function generateIntCnst(input) {
  var intPatterns = [
    "0[xX]{H}+{IS}?",
    "0{D}+{IS}?",
    "{D}+{IS}?",
    "L?'(\\.|[^\\'\n])+'"
  ];
  var matches = [];
  for (var pattern of intPatterns.map(replaceRegexBlobs)) {
    let match = getFirstRegexMatch(pattern, input);
    if (match) matches.push(match);
  }
  if (matches.length > 0) {
    //Return longest matches
    var longestMatch = matches[0];
    for (let match of matches) {
      if (match.length > longestMatch.length) longestMatch = match;
    }
    return new Token(longestMatch, "INT");
  }
  else {
    throw ("Unable to generate Int Constant out of input.");
  }
}

function generateFloatCnst(input) {
  var floatPatterns = [
    '{D}+{E}{FS}?',
    '{D}*\.{D}+({E})?{FS}?',
    '{D}+\.{D}*({E})?{FS}?',
    '0[xX]{H}+{P}{FS}?',
    '0[xX]{H}*\.{H}+({P})?{FS}?',
    '0[xX]{H}+\.{H}*({P})?{FS}?',
  ];
  var matches = [];
  for (var pattern of floatPatterns.map(replaceRegexBlobs)) {
    let match = getFirstRegexMatch(pattern, input);
    if (match) matches.push(match);
  }
  if (matches.length > 0) {
    //Return longest matches
    var longestMatch = matches[0];
    for (let match of matches) {
      if (match.length > longestMatch.length) longestMatch = match;
    }
    return new Token(longestMatch, "FLOAT");
  }
  else {
    throw ("Unable to generate Float Constant out of input.");
  }
}

function generateStringLiteral(input) {
  var stringRegex = 'L?"(\\.|[^"])*"';
  var match = getFirstRegexMatch(stringRegex, input);
  if (match) {
    return new Token(match, "STRING");
  }
  else {
    throw ("Unable to generate string literal out of input.");
  }
}

function generateOperator(input) {
  var keyWordToKind = new Map([
    ["...", "ELLIPSIS"],
    [">>=", "RIGHT_ASSIGN"],
    ["<<=", "LEFT_ASSIGN"],
    ["+=", "ADD_ASSIGN"],
    ["-=", "SUB_ASSIGN"],
    ["*=", "MUL_ASSIGN"],
    ["/=", "DIV_ASSIGN"],
    ["%=", "MOD_ASSIGN"],
    ["&=", "AND_ASSIGN"],
    ["^=", "XOR_ASSIGN"],
    ["|=", "OR_ASSIGN"],
    [">>", "RIGHT_OP"],
    ["<<", "LEFT_OP"],
    ["++", "INC_OP"],
    ["--", "DEC_OP"],
    ["->", "PTR_OP"],
    ["&&", "AND_OP"],
    ["||", "OR_OP"],
    ["<=", "LE_OP"],
    [">=", "GE_OP"],
    ["==", "EQ_OP"],
    ["!=", "NE_OP"]
  ]);
  var token = null;
  for (var [key, value] of keyWordToKind) {
    if (input.startsWith(key)) {
      token = new Token(key, value);
      break;
    }
  }
  if (token) return token;
  else throw ("Unable to generate operators out of input.");
}

function generateSpecialChar(input) {
  var keyWordToKind = new Map([
    [";", ";"],
    ["{", "{"],
    ["<%", "{"],
    ["}", "}"],
    ["%>", "}"],
    [",", ","],
    [":", ":"],
    ["=", "="],
    ["(", "("],
    [")", ")"],
    ["[", "["],
    ["<:", "["],
    ["]", "]"],
    [":>", "]"],
    [".", "."],
    ["&", "&"],
    ["!", "!"],
    ["~", "~"],
    ["-", "-"],
    ["+", "+"],
    ["*", "*"],
    ["/", "/"],
    ["%", "%"],
    ["<", "<"],
    [">", ">"],
    ["^", "^"],
    ["|", "|"],
    ["?", "?"],
  ]);
  var token = null;
  for (var [key, value] of keyWordToKind) {
    if (input.startsWith(key)) {
      token = new Token(key, value);
      break;
    }
  }
  if (token) return token;
  else throw ("Unable to generate special chars out of input.");
}
//TODO : make tryEach return an array of tokens and pick largest in generateSingleToken
function tryEach(functions, input) {
  var returnValues = []
  for (let [index, fnct] of functions.entries()) {
    try {
      var returnValue = fnct(input);
      console.log("Successfully Generated token:", returnValue);
      returnValues.push(returnValue);
    }
    catch (ex) {
      console.log(ex);
      if (index === (functions.length - 1) && returnValues.length === 0) throw ("None of the functions succeeded");
    }
  }
  return returnValues;
}

//For now returns array of tokens for testing. TODO: make it return longest token only. 
function generateSingleToken(input) {
  try {
    return tryEach(
      [generateComment, generateKeywords, generateIdentifier, generateIntCnst, generateFloatCnst, generateStringLiteral, generateOperator, generateSpecialChar
      ], input);
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