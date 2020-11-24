const jwt = require("jsonwebtoken")

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            let token = req.headers["authorization"];
            
            if (token.includes("Bearer")) {
                token = token.slice(7);
            }
            const decode = await jwt.verify(token, "secret");
            if (decode.email != req.body.email) {
                res.status(203).send("You are not allowed to post, put or delete Articles with this Email")
            } else {
                next()
            }
        } catch (error) {
            res.status(203).send("You are not allowed to POST articles")
        }
    },
    verifyTokenDel: async (req, res, next) => {
        try {
            let token = req.headers["authorization"];
            
            if (token.includes("Bearer")) {
                token = token.slice(7);
            }
            const decode = await jwt.verify(token, "secret");
            if (decode.email != req.params.email) {
                res.status(203).send("You are not allowed to post, put or delete Articles with this Email")
            } else {
                next()
            }
        } catch (error) {
            res.status(203).send("You are not allowed to POST articles")
        }
    }
}