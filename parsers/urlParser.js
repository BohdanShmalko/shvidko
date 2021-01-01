const urlStandartForm = (url) => {
    const parseUrl = url.split('/')
    parseUrl.splice(0,1)

    let urlWithoutParams = ''
    let params = []

    for(let value of parseUrl){
        if(value[0] != ':') urlWithoutParams += `/${value}`
        else {
            urlWithoutParams += '/*'
            params.push(value)}
    }
    return {urlWithoutParams, params}
}

const urlParser = (routing, req, res) => {
    if(req.method == 'GET' || req.method == 'DELETE'){
        let method = req.method.toLowerCase()
    const {urlWithoutParams, params} = urlStandartForm(req.url)

        if(routing[method][urlWithoutParams]) {
            let reqParams = {}
            const urlParamsName =  routing[method][urlWithoutParams].params
            for(let i = 0; i < urlParamsName.length; i++) {
                let paramName = urlParamsName[i].substr(1)
                let paramValue = params[i].substr(1)
                reqParams[paramName] = paramValue
            } 
            req.params = reqParams
            routing[method][urlWithoutParams].callback(req, res)
        }else res.end('page not found')
    }
}

module.exports = {urlParser, urlStandartForm}