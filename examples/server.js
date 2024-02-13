const { Prism } = require("prism-server/dist/prism");
const app = new Prism();

app.use((req, res, next) => {
  console.log("Middleware 1");
  next();
});

app.use({
  path: "/about",
  callbackFunction: (req, res, next) => {
    console.log("Middleware 2");
    next();
  },
});

app.get({
  path: "/sn",
  callbackFunction: (req, res) => {
    res.send("I am the home page");
  },
});

app.get({
  path: "/about/:id",
  callbackFunction: (req, res) => {
    console.log(req.params.id);
    res.send("I am the about page");
  },
});

app.listen({
  port: 3000,
  callback: () => {
    console.log("Server is running on port 3000");
  },
});
