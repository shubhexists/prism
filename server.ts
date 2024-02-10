import cors from "cors";
import { Prism } from "./src/prism";

const app = Prism();
app.use(cors());

app.use((req: any, res: any, next: any) => {
  console.log("I am a middleware");
  next();
});

app.get({
  path: "/about",
  callbackFunction: (req, res) => {
    res.send("I am the about page");
  },
});

app.post({
  path: "/about",
  callbackFunction: (req, res) => {
    res.send("I am the about page");
  },
});

app.listen({
  port: 3000,
  callback: () => {
    console.log("Server is running on port 3000");
  },
});
