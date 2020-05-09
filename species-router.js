const express = require("express")
const router = express.Router()
const axios = require("axios")
let allSpecies = []

let speciesUrl = "https://swapi.dev/api/species"

//function that calls remote API
async function asyncGetAllSpecies(req, res, next) {
  let url = speciesUrl
  while (url) {
    let response = await axios.get(url)
    let data = response.data
    console.log("Got results:",data.results.length)
    allSpecies = allSpecies.concat(getNamesAndIds(data.results))
    url = data.next
  }
  req.species = allSpecies
  next()
}

//helper function to deal with array
function getNamesAndIds(data) {
  return data.reduce((initial, next) => {
    let species = {
      name: next.name,
      url: next.url
    }
    initial.push(species)
    return initial
  }, [])
}


//define route handler
router.get("/all", asyncGetAllSpecies, (req,res) => {
  if (req.species) {
  console.log("it works!")
  res.send(req.species)
  } else {
    console.log("it didn't work.")
    res.sendStatus(500)
  }
})

module.exports = router