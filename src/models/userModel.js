const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const { Schema } = mongoose;

// Define the schema for a user
const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            default: ""
        },
        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Create and export the user model
userSchema.plugin(encrypt, {
    encryptionKey: process.env.MONGOOSE_ENC_KEY,
    fields: ["email", "password"],
    decryptPostSave: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
