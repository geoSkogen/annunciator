window.addEventListener("load", initFuncs);

function initFuncs() {
  var ins = document.getElementsByTagName("input");
  var buts = document.getElementsByTagName("button");
  var ps = document.getElementsByTagName("p");
  var article = document.getElementsByClassName("getItVar")[0];
  var onesNTeens = ["","one","two","three","four","five","six","seven","eight","nine",
  "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  var tens  = ["","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  var mils = ["","thousand","million","billion","trillion","quadrillion","quintillion"];

  var tokenString = "";
  var spokenString = "";
  var testvar = "";
  buts[0].onclick = parseString;
  ins[0].addEventListener("keypress", function () { if (event.keyCode === 13) {
    buts[0].click(); } });

  function parseString() {
    spokenString = "";
    var splitString = [];
    var splitCount = 0;
    var stringIn = ins[0].value;
    var trueValue = Number(stringIn);
//places only numeric input into an array
    for (var i = 0; i < stringIn.length; i++) {
      if(!isNaN(stringIn.charAt(i))) {
      splitString[splitCount] = Number(stringIn.charAt(i));
      splitCount++;
      }
    }
//cleans zeros from left to right
    if (splitString[0] == 0) {
      var backward = splitString.reverse();
      while (backward[backward.length-1] == 0) {
        backward.pop();
      }
      splitString = backward.reverse();
    }
    ps[1].innerHTML = stringIn;
    stringIn = splitString.join("");

    var tokenCount = Math.floor(stringIn.length/3);
    var leadDigitCount = (tokenCount < 1)? splitString.length : stringIn.length % 3;
//separates data into three-digit "tokens",
//with possibly one or two "lead" digits
    var leadString = "";
    var leadNum = 0;

    if (leadDigitCount != 0) {
      for (var i = 0; i < leadDigitCount; i++) {
        leadString += splitString[i];
      }
      leadNum = Number(leadString);
      readLeadNum(leadNum, tokenCount, trueValue);
    }

//places three-digit "tokens" into an array
    var tokens = [];
    var tokenTimer = 0;
    var splitTimer = 0;

    if (tokenCount != 0) {
      for (var i = 0; i < tokenCount; i++) {
        tokens[i] = "";
      }
      for (var i = leadDigitCount; i < splitString.length; i++) {
        tokens[tokenTimer] += splitString[i];
        splitTimer++;
        if (splitTimer == 3) {
          tokenTimer++;
          splitTimer = 0;
        }
      }
      var j = tokens.length - 1;
      for (var i = 0; i < tokens.length; i++) {
        readToken(tokens[i], j);
        j--;
      }
    }
    article.style.opacity = 0.60;
    ps[0].innerHTML = spokenString;
    ins[0].value = "";
  }

  function readToken(triplet, place) {
    var cent = Number(triplet.charAt(0));
    var left = Number(triplet.charAt(1));
    var right = Number(triplet.charAt(2));
    var joined = Number(triplet.charAt(1) + triplet.charAt(2));
    var tokenTotal =  cent + left + right;
    var zillion = (tokenTotal === 0)? "" : mils[place];
    var comma = (place === 0 || tokenTotal === 0)? " " : ", ";
    var hundred = (cent === 0)? "" : "hundred";

    spokenString += onesNTeens[cent] + " " + hundred + " ";

    if (joined > 19) {
       spokenString += tens[left] + " " + onesNTeens[right] + " " + zillion + comma;
    } else {
       spokenString += onesNTeens[joined] + " " + zillion + comma;
    }
  }

  function readLeadNum(leadNum, place, value) {
     var stringNum = leadNum.toString();
     var trueString = value.toString();
     var slicedString = trueString.slice(stringNum.length);
     var tokenTotals = 0;
     for (var i = 0; i < slicedString.length; i++) {
       var digit = Number(slicedString.charAt(i));
       tokenTotals += digit;
     }
     var comma = (tokenTotals === 0)? " " : ", ";

     var left = Number(stringNum.charAt(0));
     var right = Number(stringNum.charAt(1));

     if (leadNum > 19) {
       spokenString = tens[left] + " " + onesNTeens[right] + " " + mils[place] + comma;
     } else {
       spokenString = onesNTeens[leadNum] + " " + mils[place] + comma;
     }
  }
}