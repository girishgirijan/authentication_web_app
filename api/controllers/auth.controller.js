import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//Signup
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //Checking whether username is already exist
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(200).json({ message: "Username is already exist" });
    } else {
      //Checking whether email id is already exist
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        res.status(200).json({ message: "Email is already exist" });
      } else {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
      }
    }
  } catch (error) {
    next(error);
  }
};

//Signin
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validUser = await User.findOne(
      { email },
      { _id: 1, username: 1, email: 1, password: 1, profilePicture: 1 }
    );
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return next(errorHandler(401, "Invalid login credentials"));

    const { password: hashedPassword, ...rest } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    
    const expiryDate = new Date(Date.now() + 3600000); //1 Hour
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

//Google login
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if(user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); //1 Hour
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword1, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); //1 Hour
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

//Signout
export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json("Signout success")
}