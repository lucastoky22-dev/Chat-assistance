
/*let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&!^*()_\-+=\[\]{}:'",.<>\/\\|`~])(?!.*(123456|abcdef|qwerty|password|azerty))[A-Za-z\d@#$%&!^*()_\-+=\[\]{};:'",.<>\/\\|`~]{12,}$/;
const  validateMatricule = /\d{6,}/;
let matricule = "53743,6";
let password = "123";
console.log("isValidMatricule : " + validateMatricule.test(matricule));*/

let p = 0;


/*function callHimself(){
  console.log("recursive function call n°" + p++);
  callHimself();
}

callHimself();*/

while(true){
  console.log("recursive function call n°" + p++);
}