import jwt from "jsonwebtoken"

export const generateAccessToken = async (user)=>{
   return jwt.sign({
    id: user.id,
    role: user.role
   },
   process.env.ACCESS_TOKEN_SECRET, 
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  })
}

export const generateRefreshToken = async(user)=>{
   return jwt.sign({
    id: user.id,
   },
  process.env.REFRESH_TOKEN_SECRET,
{
   expiresIn: process.env.REFRESH_TOKEN_EXPIRY
})
}