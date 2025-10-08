import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) =>{
    try {
        const token = req.cookies.token;
        
        if(!token){
            return res.status(401).json({
                message:"User not authenticated",
                success:false,
            })
        }

        const decode =  jwt.verify(token, process.env.SECRET_KEY)
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false,
            })
        }

            const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

        req.user = user;  
        
        req.id = decode.userId;
        console.log("Authenticated user ID:", req.id);


        console.log("Passed at authentication block")
        next();
    } catch (error) {
        console.log("authentication error")
        console.log(error);
         return res.status(500).json({ message: "Internal server error", success: false });
        
    }
}