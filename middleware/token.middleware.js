
var { expressjwt: jwt } = require("express-jwt");

/** Middleware which one checking token */
const authenticateJWT = jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'] });

/** NEW FEAUTERS =>
 * SAVE EXPIRED TOKENS INTO REDIS OR MONGODB
*/
const expiredTokens = [];

function isTokenExpired(req, res, next) {
    const token = req.headers.authorization; // Assuming token is passed in the Authorization header

    if (expiredTokens.includes(token)) {
        return res.status(401).json({ message: 'Token is expired. Please login again.' });
    }

    next();
}

module.exports = {
    expiredTokens,
    isTokenExpired,
    authenticateJWT
};
