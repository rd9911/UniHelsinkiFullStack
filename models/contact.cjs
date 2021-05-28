const mongoose = require('mongoose')

const uri = "mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@contacts-app.5wdr9.mongodb.net/contact-app?retryWrites=true&w=majority"
console.log('connecting to ', uri)
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(res => console.log('connected to MongoDB', res))
  .catch(err => console.log(err))
const contactSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
  date: Date
})

contactSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        delete returnedObj._id
        delete returnedObj.__v 
    }
})

module.exports = mongoose.model('Note', contactSchema)