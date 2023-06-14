const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const { Schema } = mongoose;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        messages: [messageSchema]
    },
    {
        timestamps: true
    }
);

chatSchema.plugin(encrypt, {
    encryptionKey: process.env.MONGOOSE_ENC_KEY,
    fields: ["participants", "messages.sender", "messages.content"],
    decryptPostSave: true
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
