const { response, request } = require('express');
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const Contact = require('./models/contact.cjs');
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const generateId = () => {
    const randNum = Math.floor(Math.random() * 5000)
    return randNum;
}

app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts)
    })
})

app.get('/info', (req, res) => {
    Contact.find({})
        .then(contacts => {
            let message = `Phonebook has info for ${contacts.length} people`
            const timeStamp = new Date()
            console.log(message, timeStamp)
            res.send(`<div><p>${message}</p><p>${timeStamp}</p></div>`)
        })
})

app.get('/api/persons/:id', (req, res) => {
    Contact.find({id: Number(req.params.id)})
        .then(selectedContact => {
            if (!selectedContact) {
                res.status(404).end()
            } else {
                res.json(selectedContact)
            }
        })   
})

app.delete('/api/persons/:id', (req, res) => {
    Contact.findOneAndDelete({id: Number(req.params.id)})
        .then(updatedContacts =>{
            res.json(updatedContacts)
        }
    )
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(body.name)
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "missing data"
        })
    } else if (Contact.find({name: body.name})) {
        Contact.findOneAndUpdate({name: body.name}, {$set: {number: body.number}}, {new:true})
            .then(updatedContacts => 
                res.json(updatedContacts)
            )
            .catch(err => console.log(err))
    } else {
        const contact = Contact({
            id: generateId(),
            name: body.name,
            number: body.number,
            date: new Date()
        })
        contact.save()
            .then(savedContact => {
                res.json(savedContact)
            })
            .catch(err => {
                console.log(err)
            })
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is working on ${PORT}`)
})