import jwt from 'jsonwebtoken'
export const ensureAuthenticated = async (req , res, next) => {
    const auth = req.headers.authorization
    if(!auth){
        return res.status(403).json({message:"Unauthorized, JWT token requires"})
    }
    try{
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(403).json({message:"Unauthorized, JWT token expired or invalid"});
    }
}