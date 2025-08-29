const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // 30 দিনের জন্য ভ্যালিড
    });
};

module.exports = generateToken;