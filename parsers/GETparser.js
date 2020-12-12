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

const getParser = (routing, req, res) => {
    if(req.method == 'GET'){
    const {urlWithoutParams, params} = urlStandartForm(req.url)

        if(routing[urlWithoutParams]) {
            let reqParams = {}
            const urlParamsName =  routing[urlWithoutParams].params
            for(let i = 0; i < urlParamsName.length; i++) {
                let paramName = urlParamsName[i].substr(1)
                let paramValue = params[i].substr(1)
                reqParams[paramName] = paramValue
            } 
            req.params = reqParams
            routing[urlWithoutParams].callback(req, res)
        }else res.end('page not found')
    }
}

module.exports = {getParser, urlStandartForm}