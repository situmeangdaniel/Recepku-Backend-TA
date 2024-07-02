var bycript = require('bcryptjs')
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')

// define model
const Profile = require('../model/profile.model')

// middleware for authentication token with jason web token decoder
const secretKey = 'MyLovelyYaeMiko'
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if(token == null){
        return res.status(401).json({
            error: true,
            message: 'Unauthorized'
        })
    }
    jwt.verify(token, secretKey, (err, user)=>{
        console.log(jwt.decode(token))
        if(err){
            return res.status(403).json({
                error: true,
                message: 'Forbidden'
            })
        }
        req.user = user
        next()
    })
}

// define controller
// get all users
exports.getAllUsers = (req, res) => {
    Profile.getAllUsers((err, data) => {
        if(err){
            res.status(500).json({
                error: true,
                message: 'tidak ada user',
                data: err
            })
        } else {
            res.status(200).json({
                message: 'success',
                data: data
            })
        }
    })
}

// register user
exports.register = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password ) {
        return res.status(500).json({
            error: true,
            message: 'All fields are required',
        })
    } else if (username.length < 5) {
        return res.status(500).json({
            error: true,
            message: 'Username harus lebih dari 5 karakter'
        })
    } else if (username.length > 20) {
        return res.status(500).json({
            error: true,
            message: 'Username harus kurang dari 20 karakter'
        })
    } else if (password.length < 8) {
        return res.status(500).json({
            error: true,
            message: 'Password harus lebih dari 8 karakter'
        })
    } else if (password.length > 20) {
        return res.status(500).json({
            error: true,
            message: 'Password harus kurang dari 20 karakter'
        })
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(500).json({
            error: true,
            message: 'Email tidak valid'
        })
    } else {
        Profile.register({ username, email, password }, (err, data) => {
            if(err){
                res.status(500).json({
                    message: 'error',
                    data: err
                })
            } else {
                res.status(200).json({
                    message: 'success',
                    data: data
                })
            }
        })
    }
}

// login user
exports.login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password ) {
        return res.status(500).json({
            error: true,
            message: 'All fields are required',
        })
    } else {
        Profile.login({ username, password }, (err, data) => {
            console.log(data)
            var token = data.token
            if(err){
                res.status(500).json({
                    message: 'error',
                    data: err
                })
            } else {
                res.status(200).json({
                    message: 'success',
                    data: data,
                    token: token
                })
            }
        })
    }
}

// get user
exports.getUser = (req, res) => {
    authenticateToken(req, res, () => {
        Profile.getUser(req, (err, data) => {
            if(err){
                res.status(500).json({
                    message: 'Ubnauthorized',
                    data: err
                })
            } else {
                res.status(200).json({
                    message: 'success',
                    data: data
                })
            }
        })
    })
}

// logout
exports.logout = (req, res) => {
    authenticateToken(req, res, () => {
        Profile.logout(req, (err, data) => {
            var token = null
            if(err){
                res.status(500).json({
                    message: 'Ubnauthorized',
                    data: err
                })
            } else {
                res.status(200).json({
                    message: 'success',
                    data: data,
                    token: token
                })
            }
        })
    })
}

module.exports = exports