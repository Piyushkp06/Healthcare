import bcrypt from "bcrypt";
const password = await bcrypt.hash("Piyushkp06", 10);
console.log(password);
