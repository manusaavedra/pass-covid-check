const base45 = require('base45');
const cbor = require('cbor');
const pako = require('pako');
const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.post('/verify', decodeCovidCertificate)

function decodeCovidCertificate(req, res) {

    let decodedGreenpass = req.body.pass

    const greenpassBody = decodedGreenpass.substr(4);
    const decodedData = base45.decode(greenpassBody);
    const output = pako.inflate(decodedData);
    const results = cbor.decodeAllSync(output);
    
    [headers1, headers2, cbor_data, signature] = results[0].value;
    
    const greenpassData = cbor.decodeAllSync(cbor_data);
    
    return res.status(200).json({
        data: greenpassData[0].get(-260).get(1),
        toStringFormatted: JSON.stringify(greenpassData[0].get(-260).get(1))
    })
}

app.listen(port, () => {
    console.log('servidor corriendo en port: ' + port)
})