// Allow page to fully load before running any JavaScript
window.addEventListener('DOMContentLoaded', () => {

  let btn = document.getElementById("my-btn");//button by id
  let input_form = document.getElementById("token");//grabbing user value by input

  // Listen for click event on submit button and execute enclosed
  // code when event fires
  btn.addEventListener('click', () => {
    // Get input from input form
    const tokens = (<HTMLInputElement>input_form).value;
    // Get reference to result area on web page
    let good_string = document.getElementById("indicator");

    checkForSingleTerminator();

    let token: string;
    let tokenPtr = 0;

    main();

    // Check for proper positioning and occurence of terminator
    function checkForSingleTerminator() {
      let localTokens = tokens;
      let lastPos = localTokens.length - 1;
      let last = localTokens[lastPos];
      localTokens = localTokens.substring(0, lastPos);

      if(last !== '$' || localTokens.indexOf('$') !== -1)
        error();
    }

    // Put currentlly pointed to token in memory
    function getToken() {
      token = tokens[tokenPtr];
    }

    function match(t: string) {
      // If token matches t, advance the token pointer and get the
      // next token into memory
      if(token == t) {
        tokenPtr++;
        getToken();
      }
      else
        error();
    }

    // Handle error
    function error() {
      good_string.style.color = "red";
      good_string.textContent = tokens + " | Bad";
      good_string.style.visibility = "visible";
      throw new Error();
    }

    // EXP ::= TERM {(+|-) TERM}
    function Exp() {
      Term();
      while(token == '+' || token == '-') {
        if(token == '+') {
          match('+');
          Term();
        }
        else if(token == '-') {
          match('-');
          Term();
        }
      }
    }

    // TERM ::= FACTOR {(*|/) FACTOR}
    function Term() {
      Factor();
      while(token == '*' || token == '/') {
        if(token == '*') {
          match('*');
          Factor();
        }
        else if(token == '/') {
          match('/');
          Factor();
        }
      }
    }

    // FACTOR ::= (EXP) | DIGIT
    function Factor() {
      if(token == '(') {
        match('(');
        Exp();
        match(')');
      }
      else {
        Digit();
      }
    }

    // DIGIT ::= 0 | 1 | 2 | 3
    function Digit() {
      let valid_digits = ['0', '1', '2', '3'];
      if(valid_digits.indexOf(token) != -1)
        match(token);
      else
        error();
    }

    // Call Exp from here
    function command() {
      Exp();
      // If we make it back with '$', then the string was valid
      if(token == '$') {
        good_string.style.color = "green";
        good_string.textContent = tokens + " | Good";
        good_string.style.visibility = "visible";
        //alert('good');
      }
      else {
        error();
      }
        // Else it wasn't valid
    }

    function parse() {
      getToken();
      command();
    }

    function main() {
      parse();
    }

  });

  // Listen for enter keypress event inside input form.
  input_form.addEventListener('keydown', () => {
    // Initiate button press event if enter keypress event fires inside input form.
    if((<KeyboardEvent>event).keyCode === 13) {
      event.preventDefault();
      btn.click();
    }
  });

});
