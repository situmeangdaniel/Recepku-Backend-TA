var fire = require('../config/dbConfig')
var db = fire.firestore()

// define model
const Makanan = {
    getAll: (result) => {
        var makanan = []
        db.collection('makanan').get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                makanan.push(doc.data())
            })
            result(null, makanan)
        })
        .catch((err)=>{
            result(err, null)
        })
    },
    getTop: (result) => {
        var makanan = []
        db.collection('makanan')
        .orderBy('search_record', 'desc')
        .limit(10)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                makanan.push(doc.data())
            })
            result(null, makanan)
        })
        .catch((err)=>{
            result(err, null)
        })
    },
    getById: (id, result) => {
        db.collection('makanan')
        .doc(id)
        .get()
        .then((doc)=>{
            var search_record = doc.data().search_record + 1
            db.collection('makanan')
            .doc(id)
            .update({
                search_record: search_record
            })
            result(null, doc.data())
        })
        .catch((err)=>{
            result(err, null)
        })
    },
    getByTitle: (title, result) => {
        var makanan = []
        db.collection('makanan')
        .where('title', '==', title)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                makanan.push(doc.data())
            })
            result(null, makanan)
        })
        .catch((err)=>{
            result(err, null)
        })
    },
    search: (search, result) => {
        var search = search.query
        var key = Object.keys(search)
        var value = Object.values(search)
        value[0] = value[0].toLowerCase()
        
        var makanan = []
        db.collection('makanan')
        .where(key[0], '>=', value[0])
        .where(key[0], '<=', value[0] + '\uf8ff')
        .limit(10)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                makanan.push(doc.data())
            })
            if (makanan.length == 0) {
                result(null, makanan)
            }
            else{
                result(null, makanan)
            }
        })
        .catch((err)=>{
            result(err, null)
        })
    }
}

// export model
module.exports = Makanan