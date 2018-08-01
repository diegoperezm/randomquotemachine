var variable = {
 divText: document.getElementById("text"),
 paragraph : document.getElementById("paragraph"),
 buttonGetQuote: document.getElementById("buttonGetQuote"),
 quotes: [
"I threw a wish in the well",
"Don't ask me I'll never tell",
"I looked to you as it fell",
"And now you're in my way",
"I'd trade my soul for a wish",
"Pennies and dimes for a kiss",
"I wasn't looking for this",
"But now you're in my way",
"Your stare was holding",
"Ripped jeans, skin was showin'",
"Hot night, wind was blowin'",
"Where you think you're going baby?",
"Hey, I just met you and this is crazy",
"But here's my number, so call me maybe",
"It's hard to look right at you baby",
"But here's my number, so call me maybe",
"Hey I just met you and this is crazy",
"But here's my number, so call me maybe",
"And all the other boys try to chase me",
"But here's my number, so call me maybe",
"You took your time with the call",
"I took no time with the fall",
"You gave me nothing at all",
"But still you're in my way",
"I beg and borrow and steal",
"At first sight and it's real",
"I didn't know I would feel it",
"But it's in my way",
"Your stare was holding",
"Ripped jeans, skin was showin'",
"Hot night, wind was blowin'",
"Where you think you're going baby?",
"Hey, I just met you and this is crazy",
"But here's my number, so call me maybe",
"It's hard to look right at you baby",
"But here's my number, so call me maybe",
"Hey I just met you and this is crazy",
"But here's my number, so call me maybe",
"And all the other boys try to chase me",
"But here's my number, so call me maybe",
"Before you came into my life",
"I missed you so bad",
"I missed you so bad",
"I missed you so so bad",
"Before you came into my life",
"I missed you so bad",
"And you should know that",
"I missed you so so bad",
"It's hard to look right at you baby",
"But here's my number, so call me maybe",
"Hey, I just met you and this is crazy",
"But here's my number, so call me maybe",
"And all the other boys try to chase me",
"But here's my number, so call me maybe",
"Before you came into my life",
"I missed you so bad",
"I missed you so bad",
"I missed you so so bad",
"Before you came into my life",
"I missed you so bad",
"And you should know that",
"So call me maybe"
]
};



/*
| state   | input   | next state |
|---------+---------+------------|
| INITIAL | click   | LOADING    |
|         |         |            |
| LOADING | success | DISPLAY    |
|         | error   | ERROR      |
|         |         |            |
| DISPLAY | click   | LOADING    |
|         |         |            |
| ERROR   | click   | LOADING    |
*/

var fsm = {
 currentState: "INITIAL",
  states: {
   INITIAL: {
     "click": "LOADING"
   },
   LOADING: {
     "success": "DISPLAY",
      "error": "ERROR"
   },
   DISPLAY: {
     "click":"LOADING"
   },
   ERROR: {
    "click":"LOADING"
   },
  }
}; 


var quoteGenerator =  {
  currentQuote : "",
/**
 * @param {Object}     variable - Data and DOM elements   
 * @param {String} currentState   
 */
  start : function( variable, currentState) { 
    var buttonGetQuote = variable.buttonGetQuote;
    
    buttonGetQuote.addEventListener("click", () => {
      transition(variable, currentState, "click");});
  }
};


/**
 * @param {Oject}              variable - Data and DOM elements
 * @param {String}         currentState  
 * @param {String}               action - Input to change state
 * @param {Object|String}         error - String when quote is undefined
 * @description           side effects  - Modify fsm 
 */
function transition ( variable, currentState, action, error) {
 
 var state = currentState;  

  if (fsm.states[state][action]) {
   var nextState = fsm.states[state][action];
   fsm.currentState = nextState;

  switch(nextState) {
    case "LOADING":
     getQuote(variable, nextState);
    break;
    case "DISPLAY":
      displayQuote(variable); 
     break;
   case "ERROR":
      displayError(variable, nextState, action, error); 
     break;
   } 
 }
}


/**
 * @param {Object}     variable - Data and DOM elements 
 * @param {String} currentState 
 */
function getQuote(variable, currentState) {

  var quotes = variable.quotes;

/*
 * Trying to imitate an async behavior, no performance issues in my box
 * Later: make a proper API call 
 */
  var quote =  Promise.resolve(quotes); 

  quote
     .then((elements) => { 
      var min = 0;
      var max = variable.quotes.length;
      var quoteIndex = Math.floor(Math.random() * (max - min) + min);

      setQuote(variable, elements[quoteIndex]); 
      transition(variable, currentState, "success");
     })
     .catch( error => {
       transition(variable, currentState, "error", error);
    });
}



/**
 * @param  {Object}       variable - Data and DOM elements  
 * @param  {String}          quote - A quote 
 * @throws {String}      Exception - When quote is undefined
 * @description       side effects - Modify  quoteGenerator
 */
function setQuote(variable, quote) {

 if( quote ===  undefined ) { 
     throw "quote is undefined";
 }

 quoteGenerator.currentQuote = quote;
}


/**
 * @param {Object}     variable  -  Data and DOM elements  
 * @description     side effects -  Modify  a DOM element 
 */
function addQuoteToPage(variable) {
 var paragraph = variable.paragraph;  
 paragraph.textContent = quoteGenerator.currentQuote; 
}

/**
 * @param {Object}          variable - Data and DOM elements 
 * @param {String}      currentState 
 * @param {String}          action   - The input to change state 
 * @param {Object|String}    error   -  
 */
function displayError(variable, currentState, action, error) {
    console.error("  state: ", currentState, "\n",
                  "action: ", action, "\n", 
                  " Error: ", error); 

    addErrorToPage(variable, error);
}



/**
 * @param {Object} variable - Data and DOM elements 
 */
function displayQuote(variable) {
    addQuoteToPage(variable);
}


/**
 * @param {Object}           variable - Data and DOM elements 
 * @param {Object|String}    error -  
 */
function addErrorToPage(variable, error) {
 var paragraph = variable.paragraph;  
 paragraph.textContent = error;
}


quoteGenerator.start(variable, fsm.currentState);

