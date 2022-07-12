const express = require('express')
const path = require('path')
const morgan = require('morgan')
const app = express()
const port = 3000
const fs = require('fs')
const router = express.Router();

const saveData = (data, file) => {
    const finished = (error) => {
        if(error) {
            console.log(error)
            return
        }
    }
    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFile(file, jsonData, finished)
}

app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/api/data/:fileName', (req, res) => {
    console.log(req.body)
    saveData(req.body, `${req.params.fileName}.json`)
    res.json({ "message": "data saved successfully" })
})

app.get('/api/data', (req, res) => {
    console.log(req.params)
    res.json({ "test": "test" })
})

app.get('/api/download/:fileName', function (req, res, next) {
    var filePath = __dirname + '/' + req.params.fileName + ".json"
    var fileName = req.params.fileName + ".json"; 
    console.log(req.params)
    res.download(filePath, fileName);    
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
