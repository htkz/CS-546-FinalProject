const userRoutes = require("./users");
const express = require("express");


const constructorMethod = app => {
    app.use("/users", userRoutes);
    app.use(express.static('front-end'));


    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;