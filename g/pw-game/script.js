function is_valid_password(password) {
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const teacherNames = "kietikul"; //Dancethenight@kietikulCaZn9998neptuneVenezuela
    const uppercaseRegex = /[A-Z]/;
    const planetNames = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"];
    const automata = ["Finite", "Pushdown", "Turingmachine"];
    const cfl = ["contextfreelanguage","cfl"]
    const fruit = ["watermelon","jackfruit","kumquat"]
    const periodicTableSymbols = {
        H: 1,  He: 2,  Li: 3,  Be: 4,  B: 5,  C: 6,  N: 7,  O: 8,  F: 9,  Ne: 10,
        Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, K: 19, Ar: 18,
        Ca: 20, Sc: 21, Ti: 22, V: 23, Cr: 24, Mn: 25, Fe: 26, Ni: 28, Co: 27,
        Cu: 29, Zn: 30, Ga: 31, Ge: 32, As: 33, Se: 34, Br: 35, Kr: 36, Rb: 37,
        Sr: 38, Y: 39, Zr: 40, Nb: 41, Mo: 42, Tc: 43, Ru: 44, Rh: 45, Pd: 46,
        Ag: 47, Cd: 48, In: 49, Sn: 50, Sb: 51, Te: 52, I: 53, Xe: 54, Cs: 55,
        Ba: 56, La: 57, Ce: 58, Pr: 59, Nd: 60, Pm: 61, Sm: 62, Eu: 63, Gd: 64,
        Tb: 65, Dy: 66, Ho: 67, Er: 68, Tm: 69, Yb: 70, Lu: 71, Hf: 72, Ta: 73,
        W: 74, Re: 75, Os: 76, Ir: 77, Pt: 78, Au: 79, Hg: 80, Tl: 81, Pb: 82,
        Bi: 83, Th: 90, Pa: 91, U: 92, Np: 93, Pu: 94, Am: 95, Cm: 96, Bk: 97,
        Cf: 98, Es: 99, Fm: 100, Md: 101, No: 102, Lr: 103
      };
    const opecCountries = ['Algeria', 'Angola', 'Equatorialguinea', 'Gabon', 'Iran', 'Iraq', 'Kuwait', 'Libya', 'Nigeria', 'Republicofthecongo', 'Saudiarabia', 'Unitedarabemirates', 'Venezuela'];
    let atomicNumberSum = 0;

    if (password.length < 8) {
        return "Password must be at least 8 characters long."; //level 1
    }

    let totalAsciiSum = 0;

    for (let i = 0; i < password.length; i++) { // level 2
      totalAsciiSum += password.charCodeAt(i);
      
    }
    if (totalAsciiSum <= 999) {
        console.log(totalAsciiSum)
        return "the total sum of ASCII in each character of password must be at least 999"
    }

    if (!uppercaseRegex.test(password)) {
        return "Must have at least 1 uppercase character"
    }

    if (!(specialCharacterRegex.test(password))) { // level 4
        return "Password must include at least one special character."
      }

      if (!(password.includes(teacherNames))) {
        return "Password must include TOC's Teacher name (In lowercase)" // level 5
      }
    
      for (let i = 0; i < password.length - 1; i++) {
        const symbol = password.slice(i, i + 2);
        const atomicNumber = periodicTableSymbols[symbol];
        if (atomicNumber) {
          atomicNumberSum += atomicNumber;
        }
      }
      if (atomicNumberSum != 50) { // level 6
        console.log(atomicNumberSum)
        return "The password must include two letter symbol from the periodic table that the atomic number add up to 50" 
      }

    if (!(planetNames.some(planetNames => password.includes(planetNames))))
    {
        return "The password must include at least one name of the planets in Solar System (All in lowercase)" // level 7
    }

    if (!(opecCountries.some(opecCountries => password.includes(opecCountries))))
    {
        return "The password must include at least one name of a country that is a member of Organization of the Petroleum Exporting Countries (Uppercase for first letter and no space)" // level 8
    }

    let digits = Array.from(password).filter(digit => /\d/.test(digit)).map(Number); // level 9
    if (digits.reduce((sum, digit) => sum + digit, 0) !== 35) {
        return "Sum of digits in password must be 35.";
    }

    if (!(automata.some(automata => password.includes(automata))))
    {
        return "The password must include at least one of the name of Automata Types (Uppercase for first letter and no need to include 'automata')" // level 10
    }

    if (!(cfl.some(cfl => password.includes(cfl))))
    {
        return "The password must include the type name of the following language : a^n b^n ; n >= 0 (All in lowercase and no space) " // level 11
    }

    if (!(fruit.some(fruit => password.includes(fruit))))
    {
        showModal();
        return "The password must include at least one of the name from the following fruits (All in lowercase)" // level 12
    }
    let pattern = /\d/;

    closeModal();
    return "Password is valid.";
    
}

function checkPassword() {
    let password = document.getElementById("password").value;
    let validationDiv = document.getElementById("validation");
    let validationResult = is_valid_password(password);

    validationDiv.textContent = "Enter Something";
    if (validationResult.includes("valid")) {
        validationDiv.style.color = "green";
    } else {
        validationDiv.style.color = "red";
    }

    validationDiv.textContent = validationResult;
}

function showModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    let span = document.getElementsByClassName("close")[0];
    
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function closeModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}