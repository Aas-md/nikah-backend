const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken');

module.exports.signup = async (req, res) => {

    let { email, username, password } = req.body
    const newUser = new User({
        username: username,
        email: email,
    })
    let registeredUser = await User.register(newUser, password)

    await req.login(registeredUser, (err) => {
        if (err)
           throw new ExpressError(204,"error in signup" + err)
        const token = jwt.sign({ id: registeredUser._id }, 'secretCode', { expiresIn: '7d' })
        res.send({ status: "success", msg: "Welcome to mariageHall", user: registeredUser, token })
    })

}



module.exports.login = async (req, res) => {
    // passport.authenticate('local') ke baad req.user me authenticated user hota hai
    const user = req.user;

    // payload bana lo (jo tumhe token me chahiye)
    const payload = { 
        id: user._id,              // ya user.id
        username: user.username,
    };

    // token sign karo
    const token = jwt.sign(payload, "secretCode", { expiresIn: "1h" }) // 1 hour expire

    // client ko token return karo
    res.status(200).json({
        success: true,
        message: "Welcome to Wanderlust",
        token,                    // yeh frontend me localStorage me store karo
        user: {                   // optional: user info bhi bhej sakte ho
            id: user._id,
            username: user.username   
        }
    });
};



module.exports.logout = (req, res, next) => {

    req.logout((err) => {
        if (err) {
            throw new ExpressError(204,err)
        }
        res.json({ status: "success", msg: "You are logged out" })
    })
}