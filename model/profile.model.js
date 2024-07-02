var fire = require('../config/dbConfig')
var db = fire.firestore()
var bycript = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')

// timestamp
db.settings({
    timestampsInSnapshots: true
})

// timezone jakarta
function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

// generate uuid
function generateID (){
    var uid = uuidv4()
    db.collection('users')
    .where('uid', '==', uid)
    .get()
    .then((doc)=>{
        if(doc.empty){
            return uid
        }else{
            generateID()
        }
    })
}

// jwt
const secretKey = 'MyLovelyYaeMiko'
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null){
        return res.status(401).json({
            error: true,
            message: 'Unauthorized'
        })
    }
    jwt.verify(token, secretKey, (err, user)=>{
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

// define model
const Profile = {
    getAllUsers: (result) => {
        var users = []
        db.collection('users').get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                users.push(doc.data())
            })
            result(null, users)
        })
        .catch((error)=>{
            result(error, null)
        })
    },
    register: (data, result) => {
        const { username, email, password } = data;

        // generate uuid
        var uid = uuidv4()
        db.collection('users')
        .where('uid', '==', uid)
        .get()
        .then((doc)=>{
            if(doc.empty){
                uid = uid
            }else{
                uid = generateID()
            }
        })

        // check username and email
        db.collection('users')
        .where('username', '==', username)
        .get()
        .then((doc)=>{
            if(doc.empty){
                db.collection('users')
                .where('email', '==', email)
                .get()
                .then((doc) => {
                    if(doc.empty){
                        bycript.hash(password, 10, (err, hash)=>{
                            hashed = hash
                            db.collection('users')
                            .doc('/'+uid+'/')
                            .create({
                                'uid': uid,
                                'username': username,
                                'password': hashed,
                                'email': email,
                                'image_url': 'https://storage.googleapis.com/capstone-bangkit-bucket/Photo-Profile/dummy_photo_profile.png',
                                'created_on': convertTZ(new Date(), "Asia/Jakarta"),
                            })
                            .then(()=>{
                                result(null, {
                                    error: false,
                                    message: 'User berhasil dibuat'
                                })
                            })
                            .catch((error)=>{
                                result(error, null)
                            })
                        })
                    }
                    else{
                        result(null, {
                            error: true,
                            message: `email ${doc.docs[0].data().email} sudah terdaftar`
                        })
                    }
                }
            )}
            else{
                result(null, {
                    error: true,
                    message: `username ${doc.docs[0].data().username} sudah terdaftar`
                })
            }
        })
        .catch((error)=>{
            result(error, null)
        })
    },
    login: (request, result) => {
        const { username, password } = request
        var data = {}
        db.collection('users')
        .where('username', '==', username)
        .get()
        .then((doc)=>{
            if(doc.empty){
                db.collection('users')
                .where('email', '==', username)
                .get()
                .then((doc)=>{
                    if(doc.empty){
                        result(null, {
                            error: true,
                            message: 'username atau email tidak terdaftar'
                        })
                    }
                    else{
                        data = doc.docs[0].data()
                    }
                })
            }else{
                data = doc.docs[0].data()
            }
            if(data){
                if(bycript.compareSync(password, data.password)){
                    const token = jwt.sign({
                        uid: data.uid,
                        username: data.username,
                        email: data.email,
                        image_url: data.image_url,
                    }, secretKey, { expiresIn: '1m' })

                    result(null, {
                        error: false,
                        message: 'login berhasil',
                        token: token
                    })
                }
                else{
                    result(null, {
                        error: true,
                        message: 'password salah'
                    })
                }
            }
        })
        .catch((error)=>{
            result(error, null)
        })
    },
    getUser: (req, res) => {
        authenticateToken(req, res, (err)=>{
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            data = req.user

            if(token == null){
                res(null, {
                    error: true,
                    message: 'Unauthorized'
                })
            } else {
                res(null, {
                    error: false,
                    message: 'success',
                    data: data,
                    token: token
                })
            }
        })
    },
    logout: (req, res) => {
        authenticateToken(req, res, (err)=>{
            req.session.destroy()
            res(null, {
                error: false,
                message: 'logout berhasil',
            })
        }
    )}
}

module.exports = Profile