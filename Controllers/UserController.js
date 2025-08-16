const mongoose = require('mongoose')
const UserModel = require('../Models/user')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')


class UserController {
    static register = async (req, res) => {
        try {
            console.log(req.body)
            const { name, email, password } = (req.body)
            const check = await UserModel.findOne({ email })
            if (check) {
                return res.status(400).json({ message: "eamil already Exist" })
            }
            console.log('error')
            console.log(req.body,"hello")
            const hashedPassword = await bcrypt.hash(password, 10)
            const data = await UserModel.create({
                name, email,
                password: hashedPassword
            });
           

            res.json({
                data,
                msg: "user inserted successfully"
            })


        } catch (error) {
            console.log("error Ala Re 1!")

        }
    }
    static Login = async (req, res) => {
        try {
            const { email, password } = (req.body)
            const user = await UserModel.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: "Invalid Credentials" })
            }
            const ismatch = await bcrypt.compare(password, user.password)

            if (!ismatch) { return res.status(400).json({ message: "Invalid Credentials" }) }
            const token = jwt.sign({ ID: user._id }, 'JayshreeMahakal');
            console.log(token)
            res.cookie("token", token,{
                httpOnly:true,
            })

            // res
            //     .status(200)
            //     .json({ message: "Login Succesfully!" })

            res.status(200)
                .json({

                    message: "Login Succesfully!",
                    role: user.role,
                    name: user.name,
                    email: user.email,
                });
                
        }


        catch (error) {
            console.log("error Ala Re2 !")

        }
    }

    static profile=async(req,res)=>{
        try {
            console.log("Profile")            
        } catch (error) {
            console.log("eroor")
            
        }
    } 

    static logout = async (req,res)=>{
        try {
            res.clearCookie("token")
            res.status(200).json({message:"logout successfully"})
        } catch (error) {
            console.log(error ,"this is run in logout")
            
        }
    }


}

module.exports = UserController