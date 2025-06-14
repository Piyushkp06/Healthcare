import bcrypt from "bcrypt";
const password = await bcrypt.hash("123", 10);
console.log(password);
