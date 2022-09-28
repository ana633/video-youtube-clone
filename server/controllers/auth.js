import mongoose from "mongoose";
import User from "../models/User.js";
import { createError } from "../error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({...req.body, password: hash});

        await newUser.save();
        res.status(200).send("User has been created!");
    }catch(error){
        next(error);
    }
};

export const signin = async (req, res, next) => {
    try{
        const user = await  User.findOne({name: req.body.name});
        if(!user) return next(createError(404, "User not found!"));

        const isCorrect = await bcrypt.compare(req.body.password, user.password);

        if(!isCorrect) return next(createError(400, "Wrong credentials!"));

        const token = jwt.sign({id:user._id}, process.env.JWT);
        const {password, ...others} = user._doc;

        res.cookie("access_token", token, {
            maxAge: 10000,
            secure: true,
            httpOnly: true,
            expires: 0,
        })
        .status(200)
        .json(others);
    }catch(error){
        next(error);
    }
};

export const logOut = async (req, res, next) =>{
    res.clearCookie("jwt");
    res.redirect("/").status(200).json("logout succesful");
}

