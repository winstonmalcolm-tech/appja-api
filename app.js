const express = require("express");
const app = express();
const path = require("path");

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));


//Middlewares
const errorHandler = require("./middlewares/error_middleware");

//Route handlers
const developerRoute = require("./routes/developer_route");
const authRoute = require("./routes/auth_route");
const appRoute = require("./routes/app_route");

app.use("/uploads", express.static(path.join("uploads")));


//Routes
app.use("/auth", authRoute);
app.use("/app", appRoute);
app.use("/developer", developerRoute);

app.use("*", (req,res)=> {
    res.status(404).json({message: "Incorrect route"});
})

app.use(errorHandler);


app.listen(port, () => console.log(`Server running on port ${port}`));