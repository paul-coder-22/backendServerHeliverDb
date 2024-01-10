const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const mongoose = require('mongoose');
let { USERS, TEAM } = require('./db');

// CRUD operations
// app.get('/', async (req, res) => {
//     console.log("Hello");
//     try {
//         const users = await USERS.find({});
//         res.send(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// })


// POST /api/users: Create a new user
app.post('/api/users', async (req, res) => {
    try {
        const newUser = req.body;

        newUser.email = newUser.first_name + '@' + newUser.last_name + ".net"
        newUser.id = (await USERS.find({})).length + 1
        newUser.availability = newUser.availability === 'true' ? true : false

        const createdUser = await USERS.create(newUser);
        res.status(201).json(createdUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// PUT /api/users/:id: Update an existing user
app.put('/api/users/:id', async (req, res) => {
    try {
        const userId = req.body._id;
        const updatedUser = req.body;

        // let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const result = await USERS.findByIdAndUpdate(userId, updatedUser);

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// DELETE /api/users/:id: Delete a user
app.delete('/api/users/:id', async (req, res) => {

    try {
        const userId = req.params.id;
        let deletedUser = await USERS.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Implement filtering, searching, and pagination
app.get('/api/users', async (req, res) => {
    const { domain, gender, availability, searchTerm, page, perPage } = req.query;

    const filterQuery = {};

    let allTeamMember = await TEAM.find({});

    // Apply search term filter
    if (searchTerm) {
        let [first_name_filter, last_name_filter] = searchTerm.split(' ');

        filterQuery.$and = [
            { first_name: { $regex: new RegExp(first_name_filter, 'i') } },
            { last_name: { $regex: new RegExp(last_name_filter, 'i') } }
        ];
    }

    // Apply domain filter
    if (domain) {
        filterQuery.domain = domain;
    }

    // Apply gender filter
    if (gender) {
        filterQuery.gender = gender;
    }

    // Apply availability filter
    if (availability) {
        filterQuery.available = availability;
    }

    // Filter users based on the defined filter object
    let filteredUsers = await USERS.find(filterQuery);

    res.json({ users: filteredUsers, totalUsers: filteredUsers.length, teams: allTeamMember });
});

app.post('/api/teams', async (req, res) => {
    return
    let userIds = req.body.data
    if (userIds.length > 0) {
        try {
            // Create a team with the created users
            const newTeam = await TEAM.create({
                name: 'Awesome Team',
                members: req.body.data, // Use the _id field of each user
            });

            console.log('Team created:', newTeam);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // Disconnect from the database after performing operations
            await mongoose.disconnect();
        }
    }
})

// async function teamList() {
//     try {
//         let teamList = await TEAM.find({})


//     } catch (error) {
//         console.error('Error:', error);
//     }

// }

// teamList()
async function createTeamWithUsers() {

    return
    try {
        // Connect to the MongoDB database
        await mongoose.connect('mongodb://localhost:27017/heliverseDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create some users
        const user1 = await USERS.create({
            first_name: 'Swagata',
            last_name: 'ka swag',
            email: 'paul@Micheal.com',
            domain: 'IT',
            gender: 'Female',
            available: true,
            // other user-related fields
        });

        const user2 = await USERS.create({
            first_name: 'Swag',
            last_name: 'Paul',
            email: 'swag@paul.com',
            domain: 'Finance',
            gender: 'Female',
            available: true,
            // other user-related fields
        });

        // Create a team with the created users
        const newTeam = await TEAM.create({
            name: 'Awesome Team',
            members: [user1._id, user2._id], // Use the _id field of each user
        });

        console.log('Team created:', newTeam);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Disconnect from the database after performing operations
        await mongoose.disconnect();
    }
}

// Call the function to create a team with users

// createTeamWithUsers()

app.listen(port, () => {
    console.log("Server is up and running !");
});

