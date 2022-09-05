const CModel = require("../models/CModel")
const { v4: uuidv4 } = require("uuid");
var countries = [];

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
const api = "7afda606f9cae3626788a514e2b05c3a54ca30ab3033d174a36bd4b2daeb21a1"


function GetCountries(id) {
    return new Promise((res, rej) => {
        CModel.findOne({ id: id }, (err, data) => { err ? rej(data) : res(data) })
    })
}

function AddCountries(id, countries) {
    // console.log(countries);
    return new Promise((resolve, reject) => {
        let newdata = new CModel({
            id: id,
            countries: countries
        });
        newdata.save((err) => {
            if (!err) {
                resolve("Countries added");
            }
            else {
                reject(err);
            }
        })
    });
}


const fetchCompanies = async () => {
    var allcompanies = []
    for (page = 1; page < 33; page++) {
        const jobs = await fetch(`https://www.themuse.com/api/public/companies?page=${page}&api_key=${api}`)
        let js = await jobs.json()
        js = js.results
        cms = []
        for (i = 0; i < js.length; i++) {
            cms.push(js[i].name)
        }
        allcompanies = allcompanies.concat(cms)
    }
    let result = [...new Set(allcompanies)]
    countries = result
    console.log("countried added")
}

function checkCompanies() {
    return new Promise((resolve, reject) => {
        CModel.find({ id: 1 }, (err, data) => { err ? reject(data) : resolve({ data }) })
    }
    )
}


const validCompanies = (req, res, next) => {
    console.log("checking")
    checkCompanies().then(async (data) => {
        // console.log(data)
        if (data.data.length == 0) {
            console.log("adding companies")
            await fetchCompanies()
            await AddCountries(1, countries)
            next()
        }
        else {
            console.log("sending out")
            next()
        }
    })
}



module.exports = { GetCountries, AddCountries, validCompanies };
