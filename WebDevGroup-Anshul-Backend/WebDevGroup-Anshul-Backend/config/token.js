import jwt from "jsonwebtoken";

const getToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

export default getToken;

