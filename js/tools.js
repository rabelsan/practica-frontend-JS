export function setSelectStrins(id, data) {   
    let html = '<option></option>'
    data.forEach(item => html += `
            <option value="${item}">${item}</option>`)
    document.querySelector('#'+id).innerHTML = html
}