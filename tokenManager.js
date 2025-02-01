import jwt from 'jsonwebtoken';

export function createToken(payload, expiresIn) {
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, jwtSecret, {
        expiresIn,
    });

    return token;
}

export async function verifyToken(req, res, next) {
    const token = req.signedCookies['token'];

    if (!token || token.trim() === "") {
        return next();
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        const jwtData = jwt.verify(token, jwtSecret);
        res.jwt = jwtData;
        return next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ response: "Token Expired or Invalid" });
    }
}