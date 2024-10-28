const express = require("express");
const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

//Middlewares
const errorHandler = require("./middlewares/error_middleware");

//Route handlers
const developerRoute = require("./routes/developer_route");
const authRoute = require("./routes/auth_route");

//Routes
app.use("/auth", authRoute);
app.use("/developer", developerRoute);

app.use("*", (req,res)=> {
    res.status(404).json({message: "Incorrect route"});
})

app.use(errorHandler);


app.listen(port, () => console.log(`Server running on port ${port}`));