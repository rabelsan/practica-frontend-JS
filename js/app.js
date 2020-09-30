import { templFooter } from '../templates/footer.js'
import { templHeader } from '../templates/header.js'
import { KEY } from './config.js'
import { setSelectItems } from './tools.js'

function main() {
    let nodoKey
    let filmsPage = 1
    const storeUsers = 'users'
    
    //DOM nodes
    const formReg = document.querySelector('#f_register')
    

    const btnLog =  document.querySelector('#b_acceder')
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
        /* const aGender = formReg.querySelectorAll('[name="gender"]') */
        formReg.querySelector('#b_signup').addEventListener('click', onClickReg)
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


    const posicion = window.location.pathname.lastIndexOf('/') + 1
    const page = window.location.pathname.slice(posicion)
    document.querySelector('header').innerHTML = templHeader.render(page)
    
    const hoy = (new Date()).toLocaleDateString()
    document.querySelector('footer').innerHTML =  templFooter.render(hoy)

    if (page === 'signup.html') {
        document.addEventListener('loadstart', onLoadSignup)
    }

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
        form.querySelector('p#error_msg').classList.add('novisibility')
    }

    function onClickReg ()  {
        const formReg = document.querySelector('#f_register')
        if (!validateRegister(formReg)) {
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

    function validateRegister(form) {
        console.log('form.checkValidity()',form.checkValidity())
        if(!form.checkValidity()) {
        const inputs = [...form.querySelectorAll('input')]
        try {
            inputs.forEach((item) => {
                switch(item.type) {
                    case 'radio':
                        const aGender = [...form.querySelectorAll('[name="gender"]')]
                        if (!aGender[0].checkValidity()) {
                            const error = new Error(`Campo ${item.name} incorrecto`)
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
                        }
                        break;    
                }
            })
            return true  
        } catch (error) {
            console.log(error.message)
            console.log(error.code)
            
            let errorMsg
            switch (error.code) {
                case 'gender':
                    errorMsg = 'Es necesario seleccionar un género'
                    break;
                case 'i_email':
                    errorMsg = 'Debe introducir un correo electrónico válido'
                    break;
                case 'i_name':
                    errorMsg = 'El nombre de usuario es obligatorio'
                    break;
                case 'i_surname':
                    errorMsg = 'El nombre de usuario es obligatorio'
                    break;
                case 'i_passwd':
                    errorMsg = 'La password es obligatoria'
                    break;
                default:
                    errorMsg = 'Se ha produido un error'
                    break;
            }
            //show error paragraph
            form.querySelector('p').classList.remove('novisibility')
            form.querySelector('p').innerHTML = errorMsg
            return false
        }
        }
    }

    function onLoadSignup() {
        const method = 'GET'
        const url = 'https://restcountries.eu/rest/v2/all'   
       
        fetch(url)
        .then( resp => {
            console.log(resp)
            if (resp.status < 200 || resp.status >= 300) {
                console.log(resp.statusText)
                throw new Error('HTTP Error ' + resp.status)
            }
            return resp.json()
        })
        .then( data =>  populateCountries(data))
        .catch (error => alert(error.message))
    }

    function populateCountries(data) {
        console.log(data)
        const countries = data.map(item => item.name)
        console.log(paises)
        setSelectItems('countries', countries )
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