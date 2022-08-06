function tokenize(s) {
  // converts the string into a list of tokens
  // (+ 5 2)
  // ["(", "+", 5, 2, ")"]
  return s.replace(/\(/g, " ( ").replace(/\)/g, " ) ").trim().split(/\s+/);
}

function read_from(tokens) {
  // returns an expression from an array of tokens
  if (tokens.length == 0) {
    console.log("Unexpected EOF while reading");
  }
  let token = tokens.shift();
  if ("(" == token) {
    let L = [];
    while (")" != tokens[0]) {
      L.push(read_from(tokens));
    }
    tokens.shift();
    // ["+", 5,2]
    return L;
  } else {
    if (")" == token) console.log("Unexpected )");
    else return atom(token);
  }
}

function atom(token) {
  // returns the atom with correct data type
  if (isNaN(token)) return token;
  else return parseFloat(token);
}

function parse(s) {
  return read_from(tokenize(s));
}

class Env {
  constructor(params, args) {
    this.params = params;
    this.args = args;
    this.env = {
      "+": (a, b) => a + b,
      "-": (a, b) => a - b,
      "*": (a, b) => a * b,
      "/": (a, b) => a / b,
      "eq?": (a, b) => a == b,
      "log!": (a) => console.log(a),
    };
    if (this.params.length != 0) {
      for (let i = 0; i < this.params.length; i++) {
        env[this.params[i]] = this.args[i];
      }
    }
  }

  find(variable) {
    if (variable in this.env) return this.env;
  }
}

function eval(x) {
  const env = new Env({ params: [], args: [] });

  // if x is string
  if (typeof x == "string") return env.find(x.valueOf())[x.valueOf()];
  // if x is a number
  else if (typeof x == "number") return x;
  // if statement
  else if (x[0] == "if") {
    //  0     1       2  3
    // (if (< 10 20) 10 20)
    const test = x[1];
    const conseq = x[2];
    const alt = x[3];
    if (eval(test)) return eval(conseq);
    else return eval(alt);
  }
  // set variables statement
  else if (x[0] == "set!") env[x[1]] = eval(x[2]);
  // other expressions
  else {
    // ["+", 5,4]
    let exps = [];
    for (let i = 0; i < x.length; i++) exps[i] = eval(x[i]);
    const proc = exps.shift();
    return proc.apply(null, exps);
  }
}

const run = (expr) => console.log(eval(parse(expr)));

run("(* (+ 5 6) 11)");
run("(eq? 4 (+ 3 1))");
run("(log! 4)");
