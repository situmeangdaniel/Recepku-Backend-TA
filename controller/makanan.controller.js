// define model
const Makanan = require('../model/makanan.model')

// define controller
// get all makanan
exports.getAll = (req, res) => {
    Makanan.getAll((err, data) => {
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

// get top makanan by search record
exports.getTop = (req, res) => {
    Makanan.getTop((err, data) => {
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

// get makanan by id
exports.getById = (req, res) => {
    Makanan.getById(req.params.id, (err, data) => {
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

// get makanan by title
exports.getByTitle = (req, res) => {
    Makanan.getByTitle(req.params.title, (err, data) => {
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

// search makanan by title
exports.search = (req, res) => {
    Makanan.search(req, (err, data) => {
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

// export controller
module.exports = exports