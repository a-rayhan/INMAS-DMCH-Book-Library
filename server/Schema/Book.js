import mongoose, { Schema } from "mongoose";

const bookSchema = mongoose.Schema({

    book_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    des: {
        type: String,
    },
    serial: {
        type: String,
    },
    content: {
        type: [],
    },
    tags: {
        type: [String],
    },
    writer: {
        type: String,
    },
    type: {
        type: String,
    },
    photo: {
        type: String,
    },

    draft: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: {
            createdAt: 'publishedAt'
        }

    })

export default mongoose.model("books", bookSchema);