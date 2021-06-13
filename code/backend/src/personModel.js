const {Schema, model} = require("mongoose")

const personSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 1
    },
    lastName: {
        type: String,
        required: true,
        minLength: 1
    },
    pesel:  {
        type: String,
        required: true,
        minLength: 11,
        maxLength: 11,
        validate: {
            validator: (number) => number.split('').every(n => !isNaN(parseInt(n))),
            message: "PESEL contains forbidden characters"
        }
    }});

module.exports = model('Person', personSchema);