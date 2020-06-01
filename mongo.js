const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('anna salasana')
  process.exit(1)
}
  
const password = process.argv[2]

const url =
  `mongodb+srv://fullstackjoonas:${password}@cluster0-pf5hd.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length==3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(p => {
          console.log(p.name +' ' + p.number)
        })
        mongoose.connection.close()
      })
  }

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length==5){
    person.save().then(response => {
        console.log('added '+ person.name +' number '+ person.number +' to phonebook')
        mongoose.connection.close()
      })
}
