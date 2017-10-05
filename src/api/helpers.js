export const API_URI = process.env.NODE_ENV !== 'production' ? 'http://localhost:8000/api' : 'https://amenic.herokuapp.com/api'

// Params structure
// Param {
//   name: String,
//   value: Any
// }

export const appendParam = (params, name, value) => {
    if (!params) {
        params = []
    }

    value = String(value)
    if (name && value) {
        params.push({
            name,
            value,
        })
    }

    return params
}

// Construct query string from params
export const buildQueryString = (params) => {
    let result = ''

    if (!params || !params.length)
        return result

    result = '?'
    params.forEach((param, index) => {
        result += `${param.name}=${param.value}`
        if (index < params.length - 1) {
            result += '&'
        }
    })

    return result
}