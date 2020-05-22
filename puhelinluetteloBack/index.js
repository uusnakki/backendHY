const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('personNumber', function(req, res){
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personNumber'))


let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramos",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mick Jackson",
    number: "033-222-123",
    id: 6
  },
  {
    name: "Joonas Uusnäkki",
    number: "0442966342",
    id: 7
  },
  {
    name: "Aki Nyberg",
    number: "040-5567893",
    id: 8
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
  
})

app.get('/info', (req, res) => {
  console.log('moro')
  let content = persons.length
  let newDate = new Date()

  res.send('<p>Phonebook has info for ' + content + ' people</p>' + newDate)
  console.log('näkemiin')
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).json({
      error: 'person missing'
    })
  }
  if(persons.map(p => p.name.toLowerCase()).indexOf(body.name.toLowerCase()) !== -1){
    console.log('nimi jo käytössä')
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  const p = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(p)
  console.log("APua")
  console.log(body)

  res.json(p)
  console.log("Apuaaaa")
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})