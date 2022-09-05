const express = require("express")
const app = express()
const mongoose = require("mongoose")
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
const api = "7afda606f9cae3626788a514e2b05c3a54ca30ab3033d174a36bd4b2daeb21a1"
const cors = require("cors")
const repo = require("./repository/CountriesRepository")
// const DB_URI = "mongodb://localhost:27017/CountriesDB"
const DB_URI = "mongodb+srv://countriesdb:countries@countriesdb.dtop1pp.mongodb.net/?retryWrites=true&w=majority"
// const DB_URI = process.env.MONGODB_SERVER;


// var countries = [];

// const url = `https://www.themuse.com/api/public/jobs?page=1&api_key=${api}`

app.use(cors())
app.use(
    cors({
        // origin: process.env.FRONT,//"http://localhost:3000",
        origin: "https://huntjob.netlify.app/",
        // origin:"https://job-fetch.herokuapp.com",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
)
app.get("/", (req, res) => {
    console.log("hi")
    res.send("hi")
})

mongoose.connect(DB_URI)//DB_URI);
mongoose.connection.once("open", (err) => {
    if (!err) {
        console.log("Connection Successful")
    }
    else {
        console.log("Connection unsuccessful")
    }
})



//PAGINATION JOBS
app.get("/jobs/:page", async (req, res) => {
    const jobs = await fetch(`https://www.themuse.com/api/public/jobs?page=${req.params.page}&api_key=${api}`)
    const js = await jobs.json()
    res.json(js)
})


//GET COMPANY BY ID
// app.get("/companies/:id", async (req, res) => {
//     const company = await fetch(`https://www.themuse.com/api/public/companies/${req.params.id}`)
//     const js = await company.json()
//     console.log(js)
//     res.json(js)
// })

// GET JOB BY ID
app.get("/jobs/:id", async (req, res) => {
    const job = await fetch(`https://www.themuse.com/api/public/jobs/${req.params.id}&api_key=${api}`)
    const js = await job.json()
    res.json(js)
})


function filt(a, keyword) {
    let arr = a.split("+")
    for (i = 0; i < arr.length; i++) {
        arr[i] = arr[i].trim()
        // arr[i] = arr[i].split(" ").join("%20")
        arr[i] = keyword + arr[i]
        // console.log(arr[i])
    }
    let res = arr.join("&")
    return res
}

//Serach FIlter BY COMPANY AND CATEGORY
app.get("/jobs/:company/:category/:page", async (req, res) => {
    console.log(req.params.company)
    console.log(req.params.category)
    console.log(req.params.page)
    let c = filt(req.params.company, "company=")
    let d = filt(req.params.category, "category=")
    // console.log(c, d)
    const jobs = await fetch(`https://www.themuse.com/api/public/jobs?${c}&${d}&page=${req.params.page}&api_key=${api}`)

    const js = await jobs.json()
    console.log(js)
    res.json(js)
    // res.end()
})



app.get("/jobs/:company/:category/:descending/:level/:page", async (req, res) => {
    // console.log(req.params.company)
    // console.log(req.params.category)
    // console.log(req.params.page)
    let array = [];
    if (req.params.level !== "none") {
        let l = `&level=${req.params.level}`
        array.push(l)
    }
    else {
        let l = ''
        array.push(l)
    }

    if (req.params.descending === "true") {
        let des = `&descending=true`
        array.push(des)

    }
    else {
        let des = ''
        array.push(des)

    }

    if (req.params.company !== 'none') {
        let c = filt(req.params.company, "company=")
        array.push(c)

    }
    else {
        let c = ''
        array.push(c)

    }

    if (req.params.category !== 'none') {
        let d = filt(req.params.category, "category=")
        console.log(d)
        array.push(d)

    }
    else {
        let d = ''
        array.push(d)

    }

    let final = []
    // let array = [c,l,des,d];
    for (i = 0; i < array.length; i++) {
        if (array[i] !== '')
            final.push(array[i])
    }
    if (final.length !== 0) {
        let fstring = final.join("&")
        console.log("fstring",fstring)
        const jobs = await fetch(`https://www.themuse.com/api/public/jobs?${fstring}&page=${req.params.page}`)

        const js = await jobs.json()
        // console.log(js)
        res.json(js)
    }
    else {
        let fstring = ''
        console.log(fstring)
        const jobs = await fetch(`https://www.themuse.com/api/public/jobs?${fstring}&page=${req.params.page}`)

        const js = await jobs.json()
        // console.log(js)
        res.json(js)
    }
})

app.post("/addcompanies", (req, res) => {
    var id = 1
    repo.AddCountries(id, countries).then(data => {
        // console.log(data)
        res.status(200).send(data);
    }).catch(err => console.log(err));
})

app.get("/getcompanies", repo.validCompanies,(req, res) => {
    var id = 1
    repo.GetCountries(id).then(data => {
        res.status(200).send(data);
    })
})

app.get("/check",repo.validCompanies)





app.get("/jobs/:category/:page", async (req, res) => {
    // console.log(req.params.company)
    console.log(req.params.category)
    console.log(req.params.page)
    // let c = filtcomp(req.params.company)
    let d = filt(req.params.category, "category=")
    // console.log(c,d)
    const jobs = await fetch(`https://www.themuse.com/api/public/jobs?${d}&page=${req.params.page}`)

    const js = await jobs.json()
    // console.log(js)
    res.json(js)
    // res.end()
})



const port=process.env.PORT || 3002;

app.listen(port, () => {
    console.log("Listening at 3002")
})

