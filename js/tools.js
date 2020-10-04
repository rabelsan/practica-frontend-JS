export function loadSelectByAPI(url, selectId) {
    //const url = 'https://restcountries.eu/rest/v2/all'   
   
    fetch(url)
    .then( resp => {
        if (resp.status < 200 || resp.status > 299) {
            throw new Error('HTTP Error ' + resp.status)
        }
        return resp.json()
    })
    .then( data =>  populateSelect(selectId, data))
    .catch (error => alert(error.message))
}

function populateSelect(selectId, data) {
    const values = data.map(item => item.name)
    setSelectItems(selectId, values )
}

export function setSelectItems(id, data) {   
    let html = '<option></option>'
    data.forEach(item => html += `
            <option value="${item}">${item}</option>`)
    document.querySelector('#'+id).innerHTML = html
}