const mongoose =require( 'mongoose')
const { Schema } = mongoose;

const account = new Schema({
   name:{type:String,require},
   password:{type:String,require}
},{timestamps:true})
module.exports = mongoose.model("Account", account)
