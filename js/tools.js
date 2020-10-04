/**
* Load country list using https://restcountries.eu/rest/v2/all API.
* @param {string} url API url
* @param {string} selectId ID of HTML select element to be loaded
*/
export function loadSelectByAPI(url, selectId) {
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

/**
* Data selection before populate HTML requested select element.
* @param {string} selectId ID of HTML select element to be loaded
* @param {string} data Data object array
*/
function populateSelect(selectId, data) {
    const values = data.map(item => item.name)
    setSelectItems(selectId, values )
}

/**
* Populate HTML select element from data array filtered.
* @param {string} electId ID of HTML select element to be loaded
* @param {string} data Data string array
*/
export function setSelectItems(id, data) {   
    let html = '<option></option>'
    data.forEach(item => html += `
            <option value="${item}">${item}</option>`)
    document.querySelector('#'+id).innerHTML = html
}