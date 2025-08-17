// const mongoose = require('mongoose')
// const UserModel = require('../Models/user')
// const bcrypt = require('bcrypt')

// const jwt = require('jsonwebtoken')
// const ProfileController =require('./ProfileController')

// class UserController {
//     static register = async (req, res) => {
//         try {
//             console.log(req.body)
//             const { name, email, password } = (req.body)
//             const check = await UserModel.findOne({ email })
//             if (check) {
//                 return res.status(400).json({ message: "eamil already Exist" })
//             }
//             console.log('error')
//             console.log(req.body,"hello")
//             const hashedPassword = await bcrypt.hash(password, 10)
//             const data = await UserModel.create({
//                 name, email,
//                 password: hashedPassword
//             });
//             await ProfileController.createProfile(user._id, user.name);


//             res.json({
//                 data,
//                 msg: "user inserted successfully"
//             })


//         } catch (error) {
//             console.log("error Ala Re 1!")

//         }
//     }
//     static Login = async (req, res) => {
//         try {
//             const { email, password } = (req.body)
//             const user = await UserModel.findOne({ email })
//             if (!user) {
//                 return res.status(400).json({ message: "Invalid Credentials" })
//             }
//             const ismatch = await bcrypt.compare(password, user.password)

//             if (!ismatch) { return res.status(400).json({ message: "Invalid Credentials" }) }
//             const token = jwt.sign({ ID: user._id }, 'JayshreeMahakal');
//             console.log(token)
//             res.cookie("token", token,{
//                 httpOnly:true,
//             })

//             // res
//             //     .status(200)
//             //     .json({ message: "Login Succesfully!" })

//             res.status(200)
//                 .json({

//                     message: "Login Succesfully!",
//                     role: user.role,
//                     name: user.name,
//                     email: user.email,
//                 });
                
//         }


//         catch (error) {
//             console.log("error Ala Re2 !")

//         }
//     }





//     static profile=async(req,res)=>{
//         try {
//             console.log("Profile")            
//         } catch (error) {
//             console.log("eroor")
            
//         }
//     } 

//     static logout = async (req,res)=>{
//         try {
//             res.clearCookie("token")
//             res.status(200).json({message:"logout successfully"})
//         } catch (error) {
//             console.log(error ,"this is run in logout")
            
//         }
//     }


// }

// module.exports = UserController





const mongoose = require("mongoose");
const UserModel = require("../Models/user");
const ProfileModel = require("../Models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  // ===================== REGISTER =====================
  static register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // 1. Check if user exists
      const check = await UserModel.findOne({ email });
      if (check) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // 2. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Create user
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });

      // 4. Create profile automatically
      await ProfileModel.create({
        userId: user._id,
        name: user.name,
      });

      // 5. Response
      res.status(201).json({
        msg: "User registered successfully",
        user,
      });
    } catch (error) {
      console.error("Error in register:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  };

  // ===================== LOGIN =====================
  static Login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // 2. Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // 3. Create JWT token
      const token = jwt.sign({ ID: user._id }, "JayshreeMahakal", {
        expiresIn: "7d",
      });

      // 4. Set token in httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // secure only in prod
        sameSite: "strict",
      });

      // 5. Ensure profile exists
      let profile = await ProfileModel.findOne({ userId: user._id });
      if (!profile) {
        profile = await ProfileModel.create({
          userId: user._id,
          name: user.name,
        });
      }

      // 6. Response
      res.status(200).json({
        message: "Login Successfully!",
        token, // also stored in cookie, frontend can use it too
        role: user.role,
        name: user.name,
        email: user.email,
        userId: user._id,
        profile,
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  };

  // ===================== LOGOUT =====================
  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
      console.error("Error in logout:", error);
      res.status(500).json({ message: "Server error during logout" });
    }
  };
}

module.exports = UserController;
