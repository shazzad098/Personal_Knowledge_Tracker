const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        url:{
            type: String,
            required: true,
            trim: true,
            validate:{
                validator: function (v){
                    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
                },
                message: (props) => `${props.value} is not a valid URL!`,
            }
        },
        title:{
            type: String,
            required: true,
            trim: true,
        },
        description:{
            type: [String],
            default: [],
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Bookmark', bookmarkSchema);