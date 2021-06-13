const Person = require("./personModel")

const express = require('express')
const redis = require('redis')
const mongoose = require("mongoose");
const cors = require("cors");



const app = express()
app.use(cors());
app.use(express.json());
require('dotenv').config()


// -------------------------  ENV  -------------------------

const {PORT, MONGO_HOST, MONGO_PORT, REDIS_HOST, REDIS_PORT, MONGO_INITDB_DATABASE} = process.env


// ------------------------- REDIS -------------------------
const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);

redisClient.on("error", (error) => {
    console.log({redisError: error});
});

redisClient.on("connect", (err) => {
    console.log(`connected to Redis (${REDIS_HOST}:${REDIS_PORT})`);
});

// ------------------------- MONGO -------------------------
mongoose
  .connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_INITDB_DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );
  })


// ------------------------- ROUTES -------------------------
app.post('/',async (req, res) => {
  try {
    const {firstName, lastName, pesel} = req.body
    redisClient.get(`person:${req.params.pesel}`, (_, reply_redis) => {
      if(reply_redis !== null) {
        res.statusCode = 406
        res.send({error: `Person with PESEL ${pesel} already exists`})
      }
      else {
        Person.findOne({pesel: pesel}, (_, reply_mongo) => {
          if(reply_mongo) {
            res.statusCode = 406
            res.send({error: `Person with PESEL ${pesel} already exists`})
          }
          else {
            const person = new Person({firstName, lastName, pesel})
            person.save()
              .then(_ => {
                redisClient.set(`person:${pesel}`,`${firstName} ${lastName}`, "EX", 60)
                res.statusCode = 201
                res.send({person: `${firstName} ${lastName}`, cache: {
                  inCache: false,
                  time: 60
                }})
              })
              .catch(error => {
                res.statusCode = 406
                res.send({error: error.message})
              })
          }
        })
      }
    })
    
  }
  catch(error) {
    res.statusCode = 406
    res.send({error})
  }
})

app.get('/:pesel',async (req, res) => {
  try {
    if(req.params.pesel.length !== 11 || !req.params.pesel.split('').every(n => !isNaN(parseInt(n)))) {
      res.statusCode = 406
      res.send({error: "Query length has to be 11 digits long, only numbers"})
    }
    else {
      redisClient.getex(`person:${req.params.pesel}`, (_, person) => {
        if(person !== null) {
          redisClient.ttl(`person:${req.params.pesel}`, (_, cacheExpiration) => {
            res.statusCode = 200
            res.send({person, cache: {
              inCache: true,
              time: cacheExpiration
            }})
          })
        }
        else {
          Person.findOne({pesel: req.params.pesel}, (_, person) => {
            if(person) {
              redisClient.set(`person:${req.params.pesel}`,`${person.firstName} ${person.lastName}`, "EX", 60)
              res.statusCode = 200
              res.send({person: `${person.firstName} ${person.lastName}`, cache: {
                inCache: false,
                time: 60
              }})
            }
            else {
              res.statusCode = 404
              res.send({error: `Person with PESEL ${req.params.pesel} does not exist`})
            }
          })
        }
      })
    }
  }
  catch(error) {
    res.send({error})
  }
  })

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})