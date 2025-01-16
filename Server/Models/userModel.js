import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        name:{
            type: String,
            unique: true    
        },
        password: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        profilePicture: String,
        coverPicture: String,
        about: String,
        livesin: String,
        worksAt: String,
        country: String,
        relationship: String,
        followers: {
            type: [String], // Array of user IDs (strings)
            default: [],    // Default value as an empty array
        },
        following: [],
        saves:[],
        searches:[],
    },
    { timestamps: true }
)


const UserModel = mongoose.model("Users", UserSchema);

export default UserModel