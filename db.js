// db.js

const mongoose = require('mongoose');
const userdb = require('./Data/db.json')
// Replace this with your MongoDB URI
// const dbURI = 'mongodb://localhost:27017/heliverseDB';
const dbURI = 'mongodb+srv://kiron809:P%40ulkiron1999@cluster0.qbm2dcr.mongodb.net/heliverseDB?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

//users Schema

const userSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    avatar: String,
    domain: String,
    available: Boolean
});

//Manual Collection name for creating
const USERS = mongoose.model('db', userSchema, collection = 'USERSDB');


const teamSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USERS', // Assuming your user model is named 'User'
        },
    ],
});

const TEAM = mongoose.model('Team', teamSchema);



USERS.createCollection().then(function (collection) {
    console.log("DB Created");
});


// async function myUser() {
//     const user = await User.findOne({ id: 1 })
//     console.log(user);
// }
// myUser()

// User.find({}, (err, allUser) => {
//     console.log(allUser)
// })

/* /// multiple user created  

const multipleUsers = userdb;

db.collection('USERSDB').insertMany(multipleUsers, (err, result) => {
    if (err) {
        console.error('Error inserting document:', err);
        return;
    }
    console.log('Inserted a document:', result);
})
 */

module.exports = { USERS, TEAM };
