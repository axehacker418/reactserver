const mongoose = require('mongoose')
const UserModel = require('../Models/trip')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const tripModel = require('../Models/trip')
const cloudinary = require('cloudinary')


// Configuration
cloudinary.config({
    cloud_name: 'dvstgfdix',
    api_key: '749451782631583',
    api_secret: 'gDd9SbBBWc9ruG5A-6xsw64WH7M' 
});


class TripController {
    static addtrip = async (req, res) => {
        try {
            // console.log(req.body)
            const userId = req.user._id
            const { budget, location, vehicle, duration } = req.body
            const file = req.files.destinationImage
            console.log(file, "this is image")
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'CloudinaryImageUploadFolder'
            }
            )
            // console.log(imageUpload)
            const trip = await tripModel.create({
                userId,
                budget,
                location,
                vehicle,
                duration,
                destinationImage: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url
                }
            })
            res.json(trip)


        } catch (error) {
            console.log("error is in trip creation 1!", error)

        }
    }


    static getTrip = async (req, res) => {
    try {
      const userId = req.user._id;
      const trips = await tripModel.find({ userId });
      res.status(200).json(trips);
    } catch (error) {
      console.error("Error in fetching trips:", error);
      res.status(500).json({ message: "Failed to fetch trips" });
    }
    };

    static deleteTrip = async (req, res) => {
    try {
        const { id } = req.params; // Get trip id from request params

        const deletedTrip = await Trip.findByIdAndDelete(id);

        if (!deletedTrip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        res.json({ message: "Trip deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
    };
    
    static tripCancel= async(req, res)=>{
        res.json("trip cancel ")

    }

     static completeTrip= async(req, res)=>{
        res.json("trip compelete ")

    }



}

module.exports = TripController