const standartOptions = (req, res, options) => {
    for(key in options){
        res.setHeader(key, options[key])
    }
    if (req.method == "OPTIONS") res.end("ok")
}

module.exports = standartOptions