import { templFooter } from '../templates/footer.js'
import { templHeader } from '../templates/header.js'
import { KEY } from './config.js'
import { loadSelectByAPI, setSelectItems } from './tools.js'

function main() {
    const SPProvinces = ["A Coruña", "Araba", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", 
                         "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", 
                         "Cuenca", "Girona", "Granada", "Guadalajara", "Gipuzkoa", "Huelva", "Huesca", "Jaén", "La Rioja", 
                         "Las Palmas", "León", "Lérida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Ourense", "Palencia",
                         "Pontevedra", "Salamanca", "Segovia", "Sevilla", "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel",
                         "Toledo", "Valencia", "Valladolid", "Bizcaia", "Zamora", "Zaragoza"]
    let nodoKey
    let filmsPage = 1
    const storeUsers = 'users'
    
    //DOM nodes
    const formReg = document.querySelector('#f_register')
    const btnLog =  document.querySelector('#b_login')

    const btnSearch = document.querySelector('#b_libros')
    const btnGames = document.querySelector('#b_load_games')
    const btnprev = document.querySelector('#prev')
    const btnnext = document.querySelector('#next')

    
    //Event Handlers definition

    if (btnLog) {
        btnLog.addEventListener('click', onClickLog)
    }
    if (formReg) {
        formReg.querySelectorAll('input').forEach(item => 
            item.addEventListener('focus', () => {onFocusManager(formReg)}))
        formReg.querySelectorAll('select').forEach(item => 
                item.addEventListener('focus', () => {onFocusManager(formReg)}))
        formReg.querySelectorAll('textarea').forEach(item => 
                    item.addEventListener('focus', () => {onFocusManager(formReg)}))
        const aGender = formReg.querySelectorAll('[name="gender"]') 
        formReg.querySelector('#b_signup').addEventListener('click', onClickSignUp)
        formReg.querySelector('#s_countries').addEventListener('change', onCountryChange)
        //Load Selects
        loadSelectByAPI('https://restcountries.eu/rest/v2/all', 's_countries')
        setSelectItems('s_provinces', SPProvinces)
    }
    
    if (btnSearch){
        btnSearch.addEventListener('click', onClickSearch)
    }

    if (btnGames) {
        btnGames.addEventListener('click', onClickGames)
        nodoKey = document.querySelector('#api_key')
        nodoKey.value = KEY
        btnprev.addEventListener('click', () => {goToPage(-1)})
        btnnext.addEventListener('click', () => {goToPage(+1)})
    }

    //Header-Footer setup 
    const posicion = window.location.pathname.lastIndexOf('/') + 1
    const page = window.location.pathname.slice(posicion)
    document.querySelector('header').innerHTML = templHeader.render(page)
    
    const hoy = (new Date()).toLocaleDateString()
    document.querySelector('footer').innerHTML =  templFooter.render(hoy)

    function onClickLog () {
            const formLogin = document.querySelector('#f_login')
        
        if (!validarForm(formLogin)) {
            return 
        }
        const users = window.localStorage.getItem(storeUsers) ?
        JSON.parse(window.localStorage.getItem(storeUsers)) : []
        const inputs = [...formLogin.querySelectorAll('input')]

    
        let findUser = users.find( item => item.nombre.toUpperCase() == inputs[0].value.toUpperCase())
        console.log(findUser)
        if (!findUser) {
            console.log('Usuario no encontrado')
        } else  if (findUser.passwd !== inputs[1].value) {
            console.log('Password incorrecta')
        } else {
            console.log('Usuario y password correctos')
            window.location = 'usuario.html'  
        }
    }

    function onFocusManager(form) {
        form.querySelector('#error_msg').classList.add('novisibility')
    }

    function onCountryChange(ev) {
        if (ev.srcElement.options[ev.srcElement.selectedIndex].value === 'Spain') {
            console.dir(formReg.querySelector('#d_provinces').classList)
            formReg.querySelector('#d_provinces').classList.remove('nodisplay')
        }
    }

    function onClickSignUp()  {
        const formReg = document.querySelector('#f_register')
        if (!validateSignUp(formReg)) {
            return 
        }
        const inputs = [...formReg.querySelectorAll('input')]
        const usuario = {
            correo : inputs[0].value,
            nombre : inputs[1].value,
            passwd : inputs[2].value
        }
        const users = window.localStorage.getItem(storeUsers) ?
        JSON.parse(window.localStorage.getItem(storeUsers)) : []
        users.push(usuario)
        window.localStorage.setItem(storeUsers, JSON.stringify(users))
        inputs.forEach(item => item.value = '')
        // window.location = 'index.html'
    }

    function validateSignUp(form) {
        if(!form.checkValidity()) {
            const inputs = [...form.querySelectorAll('input')]
            try {
                inputs.forEach((item) => {
                    switch(item.type) {
                    case 'radio':
                        const aGender = [...form.querySelectorAll('[name="gender"]')]
                        if (!aGender[0].checkValidity()) {
                            const error = new Error(`Item ${item.name} wrong`)
                            error.code = item.name
                            throw error
                        }
                        break;
                    default:
                        if (!item.checkValidity()) {
                            //const error = new Error(`Campo ${item.id} incorrecto`)
                            const error = new Error(item.validationMessage)
                            error.code = item.id
                            throw error
                        } else {
                            //Passwords matching validation
                            if (item.id === 'i_passwd2' && 
                                item.value !== formReg.querySelector('#i_passwd1').value) {
                                    const error = new Error('Password confirmation do not match')
                                    error.code = 'i_passwd2'     
                                    throw error       
                            }
                        }
                        break;    
                    }
                })
            } catch (error) {
                let errorMsg
                switch (error.code) {
                case 'gender':
                    errorMsg = 'Gender required, please, select one option'
                    break;
                case 'i_email':
                    errorMsg = 'A valid email required'
                    break;
                case 'i_name':
                    errorMsg = 'User name required'
                    break;
                case 'i_surname':
                    errorMsg = 'Surname required'
                    break;
                case 'i_passwd1':
                    errorMsg = 'Password must contain numbers and letters, and 4 or more characters'  
                    break;
                case 'i_passwd2':
                    errorMsg = 'Password confirmation doest not match'
                    break;
                case 'i_apikey':
                    errorMsg = 'API key is required'
                    break;
                default:
                    errorMsg = 'Unknown error'
                    break;
                }
                //show error paragraph
                form.querySelector('#error_msg').classList.remove('novisibility')
                form.querySelector('#error_msg').innerHTML = errorMsg
                return false
            }    
        }
        //Countries/Provinces validation
        const countries = form.querySelector('#s_countries')
        const provinces = form.querySelector('#s_provinces')
        if (!countries.selectedIndex) {
            form.querySelector('#error_msg').classList.remove('novisibility')
            form.querySelector('#error_msg').innerHTML = 'Country selection required'
            return false
        } else if ((countries.options[countries.selectedIndex].value === 'Spain') && (!provinces.selectedIndex)) {
            form.querySelector('#error_msg').classList.remove('novisibility')
            form.querySelector('#error_msg').innerHTML = 'The Province is required for Spain'
            return false
        }
        return true
    }

    function onClickSearch() {
        const clave = document.querySelector('#clave').value
        if (!clave) {
            return
        }
        let url = 'https://www.googleapis.com/books/v1/volumes'
        url += '?q=intitle:' + clave
        document.querySelector('#clave').value =''

        fetch(url)
        .then( resp => {
            console.log(resp)
            if (resp.status < 200 || resp.status >= 300) {
                console.log(resp.statusText)
                throw new Error('HTTP Error ' + resp.status)
            }
            return resp.json()
        })
        .then( data => procesaLibros(data))
        .catch (error => alert(error.message))
    }

    function procesaLibros(data) {

        console.log(data.items)
        const titulos = data.items.map(item => {
            return {
                id: item.id,
                autores: item.volumeInfo.authors,
                titulo: item.volumeInfo.title
            }
        })
        console.log(titulos)
    }

    function onClickGames() {
        let url = 'https://api-v3.igdb.com/games?fields=name' 
        if (filmsPage > 1) {
            url += '&offset=' + 10*(filmsPage-1)
        } 

        if (!nodoKey.value) {
            alert('El API Key es necesario')
            return
        }
        //url += '&api_key='+nodoKey.value
        fetch(url, {
            headers: {
                myName: 'Alejandro',
                'user-key': nodoKey.value
            }
        })
        .then( resp => {
            console.log(resp)
            if (resp.status < 200 || resp.status >= 300) {
                console.log(resp.statusText)
                throw new Error('HTTP Error ' + resp.status)
            }
            return resp.json()
        })
        .then( data => procesaJuegos(data))
        .catch (error => alert(error.message))
    }

    function onClickOneGame(ev) {
        let url = 'https://api-v3.igdb.com/games?fields=*&id='
        url += ev.target.innerHTML
        console.log(url)
    }

    function procesaJuegos(data) {
        if(!data) {
            return
        }
        console.log(data)
        let html = ''
        data.forEach(item => {
            html += `
            <tr>
                <td class="celda_id">${item.id}</td>
                <td>${item.name}</td>
            </tr>`
        })
        document.querySelector('div.games').classList.remove('nodisplay')
        document.querySelector('table.table_games tbody')
            .innerHTML = html

        document.querySelectorAll('.celda_id').forEach(
            item => item.addEventListener('click', onClickOneGame)
        )
    }

    function goToPage(n) {
        filmsPage += n
        onClickGames()
        if (filmsPage > 1) {
            btnprev.classList.remove('ocultar')
        } else {
            btnprev.classList.add('ocultar')
        }


    }

}

document.addEventListener('DOMContentLoaded', main)