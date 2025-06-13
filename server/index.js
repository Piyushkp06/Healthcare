import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors" 

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseUrl=process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
)

app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 
mongoose
.connect(databaseUrl)
.then(()=>console.log('DB Connected Successfully'))
.catch(err=>console.log(err.message));