var variable = {
  divText: document.getElementById("text"),
  paragraph: document.getElementById("paragraph"),
  buttonGetQuote: document.getElementById("buttonGetQuote"),
  quotes: [
    "Carly Rae Jepsen (Curiosity)",
    "I threw a wish in the well",
    "Don't ask me I'll never tell",
    "I looked at you as it fell And now you're in my way."
  ]
};

/*
| state   | input   | next state |
|---------+---------+------------|
| INITIAL | click   | LOADING    |
|         |         |            |
| LOADING | sucess  | DISPLAY    |
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
      click: "LOADING"
    },
    LOADING: {
      sucess: "DISPLAY",
      error: "ERROR"
    },
    DISPLAY: {
      click: "LOADING"
    },
    ERROR: {
      click: "LOADING"
    }
  }
};

var quoteGenerator = {
  currentQuote: "",
  currentNumber: 0,

  /**
   * @param {Object}     variable - Data and DOM elements
   * @param {String} currentState
   */
  start: function(variable, currentState) {
    var buttonGetQuote = variable.buttonGetQuote;

    buttonGetQuote.addEventListener("click", () => {
      transition(variable, currentState, "click");
    });
  }
};

/**
 * @param {Oject}              variable - Data and DOM elements
 * @param {String}         currentState
 * @param {String}               action - Input to change state
 * @param {Object|String}         error - String when quote is undefined
 * @description           side effects  - Modify fsm
 */
function transition(variable, currentState, action, error) {
  var state = currentState;

  if (fsm.states[state][action]) {
    var nextState = fsm.states[state][action];
    fsm.currentState = nextState;

    switch (nextState) {
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
  var quote = Promise.resolve(quotes);

  quote
    .then(elements => {
      setQuote(variable, elements[quoteGenerator.currentNumber % 4]);
      transition(variable, currentState, "sucess");
    })
    .catch(error => {
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
  if (quote === undefined) {
    throw "quote is undefined";
  }

  quoteGenerator.currentQuote = quote;
  quoteGenerator.currentNumber += 1;
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
  console.error(
    "  state: ",
    currentState,
    "\n",
    "action: ",
    action,
    "\n",
    " Error: ",
    error
  );

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
