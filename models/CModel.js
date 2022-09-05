const mongoose = require("mongoose")
const bookSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    countries:{
        type:Array,
        required:true
    }

})

module.exports = mongoose.model("CModel",bookSchema,"Countries");
