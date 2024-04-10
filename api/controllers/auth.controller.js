import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //Checking whether username is already exist
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(500).json({ message: "Username is already exist" });
    } else {
      //Checking whether email id is already exist
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        res.status(500).json({ message: "Email is already exist" });
      } else {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
      }
    }
  } catch (error) {
    next(error)
  }
};
