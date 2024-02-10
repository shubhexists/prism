# Prism 
A minimalist web framework, aimed to replicate ExpressJS.

> [!IMPORTANT]
> Prism might be in active development and **currently does not support enough features to match ExpressJS**. Also,
> it was written more for educational purposes rather than an actual replacement.

## Installation 
Prism is still not published as a package on the npm registry. ( I would do it after is becomes stable (usable).)
So, for now, if you want ot use Prism, you need to build it from source by cloning the source code.

## Usage

Usage is exactly similar to ExpressJs. ( Some parameters are different because Prism is written in Typescript instead
of Javascript ).

```js
// Import Dependencies
import cors from "cors";

// Initialize Prism
const app = prism();

// use() for middlewares
app.use(cors());

// GET method
app.get({
  path: "/about/:id",
  callbackFunction: (req, res) => {
    console.log("jrjr");
    console.log((req as any).params.id);
    res.send("I am the about page");
  },
});

// POST method
app.post({
  path: "/about",
  callbackFunction: (req, res) => {
    res.send("I am the about page");
  },
});

// Starting the HTTP Server
app.listen({
  port: 3000,
  callback: () => {
    console.log("Server is running on port 3000");
  },
});
```

## TODO 
- [ ] - Adding function for handling files ( Currently only `GET`, `POST`, `PUT` and `DELETE` methods are supported)
- [ ] - Add other methods that might be relevant ( `PATCH` and `OPTIONS` etc etc )
- [ ] - And security requirements that might be required 

There are a lot of things that might be done/ improved . These are only a couple of things that I could think of.


## Thanks
If you read till here, thanks for showing interest in the project :)    
Drop of a ✨ if you liked it !
