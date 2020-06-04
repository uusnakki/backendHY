require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

morgan.token('personNumber', function(req, res){
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personNumber'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  console.log('infoa tulossa')
  let newDate = new Date()
  Person.find({}).then(persons => {
    let people = persons.map(p => p.toJSON()).length
    res.send('<p>Phonebook has info for ' + people + ' people</p>' + newDate)
  })
  console.log('näkemiin')
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
  .then(p => {
    if(p) {
      res.json(p)
    } else {
      res.status(404).end()
    } 
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(204).end()
  })
  .catch(error => next(error))
})


app.post('/api/persons', (req, res) => {
  const body = req.body

  const p = new Person({
    name: body.name,
    number: body.number,
    //id: generateId()
  })
  p.save()
  .then(savedPerson => {
    res.json(savedPerson)
  })
  .catch(error => next(error))
  console.log(body)
  console.log("Apuaaaa")
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'vääränmuotoinen id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})