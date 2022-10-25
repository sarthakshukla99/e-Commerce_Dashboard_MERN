const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("./db/config");
const User = require("./db/Users");
const Product = require("./db/Product");
const app = express();
const jwt = require("jsonwebtoken");
const jwtKey = "e-comm";

app.use(express.json());
app.use(cors());

// ========= routes ============

// adding user in db
app.post("/register", async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send({ result: "something went wrong. Please try again" });
        }
        res.send({ result, auth: token });
    });
});

// login user
app.post("/login", async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");

        if (user) {
            jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send({
                        result: "something went wrong. Please try again",
                    });
                }
                res.send({ user, auth: token });
            });
            // res.send(user);
        } else {
            res.send({ result: "no user found" });
        }
    } else {
        res.send({ result: "no user found" });
    }
});

// add product
app.post("/add-product", verifyToken, async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
});

// get all products
app.get("/products", verifyToken ,async (req, res) => {
    let products = await Product.find();
    if (products.length > 0) {
        res.send(products);
    } else {
        res.send({ result: "no products found" });
    }
});

// delete product
app.delete("/product/:id", verifyToken, async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    res.send(result);
});

// get single product
app.get("/product/:id", verifyToken, async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
        res.send({ result: "no product found" });
    }
});

// update product
app.put("/product/:id", verifyToken, async (req, res) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body,
        }
    );
    res.send(result);
});

// search items
app.get("/search/:key", verifyToken ,async (req, res) => {
    let result = await Product.find({
        $or: [
            { name: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } },
        ],
    });
    res.send(result);
});

// ==========================
app.get("/", (req, res) => {
    res.send("app is working..");
});


function verifyToken(req,res,next){
    let token = req.headers['authorization'];
    if(token){
        token = token.split(" ")[1];
        jwt.verify(token, jwtKey, (err,valid) => {
            if(err){
                res.send({result: 'please provide valid token'})

            }else{
                next()
            }
        });
    }else{
        res.send({result: 'please add token with header'})
    }

}

app.listen(3100);
