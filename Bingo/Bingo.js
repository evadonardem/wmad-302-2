let check = function (){
    if(age >= 18){
        return "Adult";
    } else {
        return "Minor";
    }
}

let checker = (age >= 18) ? "Adult" : "Minor";
console.log(check(12));
console.log(checker);