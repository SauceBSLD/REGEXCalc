let sumsubReg = /([-]*[\d]*[.])?[-]*[\d]+ [-\+] ([-]*[\d]*[.])?[-]*[\d]+/;
let multdivReg = /([-]*[\d]*[.])?[-]*[\d]+ [\/\*] ([-]*[\d]*[.])?[-]*[\d]+/;
let subReg = /([-]*[\d]*[.])?[-]*[\d]+ [-] ([-]*[\d]*[.])?[-]*[\d]+/;
let sumReg = /([-]*[\d]*[.])?[-]*[\d]+ [\+] ([-]*[\d]*[.])?[-]*[\d]+/;
let multReg = /([-]*[\d]*[.])?[-]*[\d]+ [\*] ([-]*[\d]*[.])?[-]*[\d]+/;
let divReg = /([-]*[\d]*[.])?[-]*[\d]+ [/] ([-]*[\d]*[.])?[-]*[\d]+/;
let parReg = /[(]([-]*[\d]*[.])?[-]*[\d]+ [*+/-] ([-]*[\d]*[.])?[-]*[\d]+[)]/;
let calcReg = /([-]*[\d]*[.])?[-]*[\d]+ [*+/-] ([-]*[\d]*[.])?[-]*[\d]+/;

// Setup tous les regex au chargement de la page
// Tous sont adaptés pour match des valeurs float dans la string originale

const convert = function (string) {
  // Convertit une équation à la fois
  const firstNum = parseFloat(string.match(/([-]*[\d]*[.])?[-]*[\d]+ /));
  const secondNum = parseFloat(string.match(/ ([-]*[\d]*[.])?[-]*[\d]+/));
  const sign = string.match(/ [*+/-] /);
  sign[0] = sign[0].trim();
  switch (sign[0]) {
    case "+":
      return `${firstNum + secondNum}`;
    case "-":
      return `${firstNum - secondNum}`;
    case "*":
      return `${firstNum * secondNum}`;
    case "/":
      if (secondNum == 0) {
        return 'ERROR';
      } else return `${firstNum / secondNum}`;
  }
};

// On récupère les nombres et le signe
// On return le résultat du calcul sous forme de string

function calculate(string) {
  const multMatch = string.match(multReg);
  const divMatch = string.match(divReg);
  const sumsubMatch = string.match(sumsubReg);
  const multdivMatch = string.match(multdivReg);
  const parMatch = string.match(parReg);
  // Les const setup chaque match nécessaire
  // On boucle tant que des calculs sont trouvés
  if (multdivMatch || sumsubMatch || parMatch) {
    let tempReg;
    let wholeCalc;
    let temp = string;
    // On initialise qq valeurs temp et check chaque opération dans l'ordre conventionnel
    if (parMatch) {
      console.log(
        `Equation in parantheses found! %c${parMatch[0]}`,
        "background-color: cyan"
      );
      const reCalc = parMatch[0].match(calcReg);
      wholeCalc = calculate(reCalc[0]); // lance calculate() avec le calcul entre parantheses et attribue son résultat à wholecalc
      regExp = new RegExp(parMatch[0]); // Crée un regex depuis la valeur à remplacer
      tempReg = adaptReg(regExp); // Adapte le regex si nécessaire
      temp = temp.replace(tempReg, wholeCalc); // Remplace le calcul effectué par son résultat
      console.log(`Now calculating : %c${temp}`, "background-color: yellow");
      return calculate(temp); // Relance calculate() avec le nouveau calcul entier
    } else if (multdivMatch) {
      console.log(
        `Multiplication/Division found! %c${multdivMatch[0]}`,
        "background-color: cyan"
      );
      regExp = new RegExp(multdivMatch[0]);
      if (multdivMatch[0].match(multReg)) {
        tempReg = adaptReg(regExp);
        temp = temp.replace(tempReg, convert(multMatch[0]));
        console.log(`Now calculating : %c${temp}`, "background-color: yellow");
        return calculate(temp);
      } else {
        temp = temp.replace(regExp, convert(divMatch[0]));
        console.log(`Now calculating : %c${temp}`, "background-color: yellow");
        return calculate(temp);
      }
    } else if (sumsubMatch) {
      console.log(
        `Sum/Substraction found! %c${sumsubMatch[0]}`,
        "background-color: cyan"
      );
      regExp = new RegExp(sumsubMatch[0]);
      if (sumsubMatch[0].match(sumReg)) {
        tempReg = adaptReg(regExp);
        temp = temp.replace(tempReg, convert(sumsubMatch[0]));
        console.log(`Now calculating : %c${temp}`, "background-color: yellow");
        return calculate(temp);
      } else {
        temp = temp.replace(regExp, convert(sumsubMatch[0]));
        console.log(`Now calculating : %c${temp}`, "background-color: yellow");
        return calculate(temp);
      }
    }
  } else {
    // On return le résultat final
    console.log(`Result : %c${string}`, "background-color: lightgreen");
    return string;
  }
}

function adaptReg(regex) {
  // Adapte le regex avec les backslash nécessaires
  // et return le nouveau regex
  let pushedReg = [];
  let newString = regex.toString();
  const par1 = newString.match(/[(]/);
  const par2 = newString.match(/[)]/);
  if (par1 || par2) {
    newString = newString.replace(par1[0], `\\${par1[0]}`);
    newString = newString.replace(par2[0], `\\${par2[0]}`);
  }
  const sign = newString.match(/[ ][*+-][ ]/);
  if (sign) {
    let symbol = sign[0].trim();
    newString = newString.replace(sign[0], ` \\${symbol} `);
  }
  for (char of newString) {
    pushedReg.push(char);
  }
  pushedReg.pop();
  pushedReg.shift();
  let finalReg = new RegExp(pushedReg.join(""));
  return finalReg;
}

// Intéractions avec le DOM

const output = document.getElementById("output");
const buttons = document.querySelectorAll("button");
const calculateBtn = document.getElementById("calculate-btn");
const resetBtn = document.getElementById("reset-btn");

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    output.value += e.target.value;
  });
});

document.addEventListener("keydown", (e) => {
  // Setup pour capter les touches du clavier
  const key = e.key;
  const number = document.querySelector(`button[value="${key}"]`);
  const sign = document.querySelector(`button[value=" ${key} "]`);
  if (number) {
    number.click();
  } else if (sign) {
    sign.click();
  } else if (key === "Enter") {
    calculateBtn.click();
  } else if (key === "Backspace") {
    resetBtn.click();
  }
});

calculateBtn.addEventListener("click", () => {
  console.log(
    `Started calculating: %c${output.value}`,
    "background-color: yellow"
  );
  output.value = calculate(output.value);
});

resetBtn.addEventListener("click", () => {
  output.value = "";
});
