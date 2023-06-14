const User = require("../models/User");
const Profile = require("../models/Profile");

const createUser = async (req, res) => {
    const { email, password, displayName, bio, avatarUrl } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user
        const user = new User({ email, password });

        // Create a new profile and link it to the user
        const profile = new Profile({ user: user._id, displayName, bio, avatarUrl });
        user.profile = profile._id;

        // Save the user and profile to the database
        await user.save();
        await profile.save();

        res.status(201).json({ message: "User and profile created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating user and profile", error });
    }
};

module.exports = { createUser };
