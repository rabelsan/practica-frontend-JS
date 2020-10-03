import { templFooter } from '../templates/footer.js'
import { templHeader } from '../templates/header.js'
import { KEY } from './config.js'
import { loadSelectByAPI, setSelectItems } from './tools.js'

function main() {
    const SPProvinces = ["A Coruña", "Albacete", "Alicante", "Almería", "Araba", "Asturias", "Ávila", "Badajoz", "Baleares", 
                         "Barcelona", "Bizcaia", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", 
                         "Cuenca", "Girona", "Granada", "Guadalajara", "Gipuzkoa", "Huelva", "Huesca", "Jaén", "La Rioja", 
                         "Las Palmas", "León", "Lérida", "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Ourense", "Palencia",
                         "Pontevedra", "Salamanca", "Segovia", "Sevilla", "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel",
                         "Toledo", "Valencia", "Valladolid", "Zamora", "Zaragoza"]
    let filmsPage = 1
    const storeUsers = 'users'
    const storeSessionUser = 'loguser'
    
    //DOM nodes
    const frmReg = document.querySelector('#f_register')
    const frmLog =  document.querySelector('#f_login')
    const divFilms = document.querySelector('div.films')
    const btnprev = document.querySelector('#prev')
    const btnnext = document.querySelector('#next')  
    
    //const btnSearch = document.querySelector('#b_libros')
    
    
    //Event Handlers definition

    if (frmLog) {
        frmLog.querySelectorAll('input').forEach(item => 
            item.addEventListener('focus', () => {onFocusManager(frmLog)}))
        frmLog.querySelector('#b_login').addEventListener('click', onClickLog)
    }
    if (frmReg) {
        frmReg.querySelectorAll('input').forEach(item => 
            item.addEventListener('focus', () => {onFocusManager(frmReg)}))
        frmReg.querySelectorAll('select').forEach(item => 
                item.addEventListener('focus', () => {onFocusManager(frmReg)}))
        frmReg.querySelectorAll('textarea').forEach(item => 
                    item.addEventListener('focus', () => {onFocusManager(frmReg)}))
        frmReg.querySelector('#b_signup').addEventListener('click', onClickSignUp)
        frmReg.querySelector('#s_countries').addEventListener('change', onCountryChange)
        //Load Selects
        loadSelectByAPI('https://restcountries.eu/rest/v2/all', 's_countries')
        setSelectItems('s_provinces', SPProvinces)
    }
    
    if (divFilms) {
        btnprev.addEventListener('click', () => {goToPage(-1)})
        btnnext.addEventListener('click', () => {goToPage(+1)})
        loadFilms()
    }

    //Header-Footer setup 
    const posicion = window.location.pathname.lastIndexOf('/') + 1
    const page = window.location.pathname.slice(posicion)
    document.querySelector('header').innerHTML = templHeader.render(page)
    
    const hoy = (new Date()).toLocaleDateString()
    document.querySelector('footer').innerHTML =  templFooter.render(hoy)

    function onClickLog () {
        if (!validateForm(frmLog)) {
            return 
        }
        const users = window.localStorage.getItem(storeUsers) ?
        JSON.parse(window.localStorage.getItem(storeUsers)) : []
        const inputs = [...frmLog.querySelectorAll('input')]
        
        let findUser = users.find( item => item.email.toLowerCase() == inputs[0].value.toLowerCase())
        if (!findUser) {
            frmLog.querySelector('#error_msg').classList.remove('novisibility')
            frmLog.querySelector('#error_msg').innerHTML = 'email not found!'
            return
        } else  if (findUser.passwd !== inputs[1].value) {
            frmLog.querySelector('#error_msg').classList.remove('novisibility')
            frmLog.querySelector('#error_msg').innerHTML = 'Wrong password'
            return
        } else {
            //Save user APIKey in session storage 
            //const users = window.sessionStorage.getItem(storeSessionAPI) ?
            //JSON.parse(window.sessionStorage.getItem(storeSessionAPI)) : []
            window.sessionStorage.setItem(storeSessionUser, JSON.stringify(findUser))
            window.location = 'films.html'  
        }
    }

    function onFocusManager(form) {
        form.querySelector('#error_msg').classList.add('novisibility')
    }

    function onCountryChange(ev) {
        if (ev.srcElement.options[ev.srcElement.selectedIndex].value === 'Spain') {
            frmReg.querySelector('#d_provinces').classList.remove('nodisplay')
        } else {
            frmReg.querySelector('#s_provinces').selectedIndex=0
            frmReg.querySelector('#d_provinces').classList.add('nodisplay')
        }
    }

    function verifyAPIKey(APIKey) {
        const method = 'GET'
        const url = 'https://api.themoviedb.org/3/discover/movie?api_key='+APIKey+
                     '&language='+navigator.language+'&sort_by=popularity.desc&include_adult=true&include_video=false&page=2'   
        console.log(url)
        fetch(url)
        .then( resp => { (resp.status < 200 || resp.status >= 300) ? false : true })
        .then( console.log(data))
        .catch (error => alert(error.message))
    }

    function onClickSignUp()  {
        const frmReg = document.querySelector('#f_register')
        if (!validateForm(frmReg)) {
            return 
        }
        //Countries/Provinces validation
        const countries = frmReg.querySelector('#s_countries')
        const provinces = frmReg.querySelector('#s_provinces')
        if (!countries.selectedIndex) {
            frmReg.querySelector('#error_msg').classList.remove('novisibility')
            frmReg.querySelector('#error_msg').innerHTML = 'Country selection required'
            return 
        } else if ((countries.options[countries.selectedIndex].value === 'Spain') && (!provinces.selectedIndex)) {
            frmReg.querySelector('#error_msg').classList.remove('novisibility')
            frmReg.querySelector('#error_msg').innerHTML = 'The Province is required for Spain'
            return 
        }
        const radios = [...frmReg.querySelectorAll('[name="gender"]')]
        const inputs = [...frmReg.querySelectorAll('input')]
        const selects = [...frmReg.querySelectorAll('select')]
        const textareas = [...frmReg.querySelectorAll('textarea')]
        const user = {
            gender : radios.filter(item => item.checked)[0].value,
            name : frmReg.querySelector('#i_name').value,
            surname : frmReg.querySelector('#i_surname').value,
            country : countries.options[countries.selectedIndex].value,
            province : provinces.options[provinces.selectedIndex].value,
            email : frmReg.querySelector('#i_email').value,
            passwd : frmReg.querySelector('#i_passwd1').value,
            apikey : frmReg.querySelector('#i_apikey').value,
            comments : frmReg.querySelector('#t_comments').value
        }
        const users = window.localStorage.getItem(storeUsers) ?
            JSON.parse(window.localStorage.getItem(storeUsers)) : []
        //In order to avoid duplicated emails
        let emailReg = -1
        for(var i=0; i<users.length; i++) {
            if (users[i].email === user.email) { 
                emailReg = i 
            }
        }
        if (emailReg !== -1) {
            users.splice(emailReg,1)
        }
        users.push(user)
        window.localStorage.setItem(storeUsers, JSON.stringify(users))
        radios.forEach(item => item.checked = false)
        inputs.forEach(item => item.value = '')
        selects.forEach(item => item.value = '')
        textareas.forEach(item => item.value = '')
        window.location = 'login.html'
    }

    function validateForm(form) {
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
                            switch (item.id) {
                                //Passwords matching validation
                                case 'i_passwd2':
                                    if (item.value !== frmReg.querySelector('#i_passwd1').value) {
                                        const error = new Error('Password confirmation do not match')
                                        error.code = 'i_passwd2'     
                                        throw error
                                    }
                                    break;
                                //Check API validity
                                case 'i_apikey':
                                    console.log('verifyAPIKey',verifyAPIKey(item.value))
                                    break;       
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
                    errorMsg = 'A valid email is required'
                    break;
                case 'i_name':
                    errorMsg = 'User name required'
                    break;
                case 'i_surname':
                    errorMsg = 'Surname required'
                    break;
                case 'i_passwd':
                    errorMsg = 'Password required'  
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
        return true
    }

    function loadFilms() {
        let loguser = window.sessionStorage.getItem(storeSessionUser) ? 
                        JSON.parse(window.sessionStorage.getItem(storeSessionUser)) : []
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${loguser.apikey}&language=${navigator.language}&sort_by=popularity.desc&include_adult=true&include_video=false`   

        if (filmsPage > 1) {
            url += '&page=' + filmsPage
        } 

        if (!loguser) {
            alert('Internal session user error')
            return
        }
        
        fetch(url)
        .then( resp => {
            if (resp.status < 200 || resp.status >= 300) {
                console.log(resp.statusText)
                throw new Error('HTTP Error ' + resp.status)
            }
            return resp.json()
        })
        .then( data => populateFilms(data))
        .catch (error => alert(error.message))
    }

    function onClickOneFilm(ev) {
        let url = 'https://api-v3.igdb.com/games?fields=*&id='
        url += ev.target.innerHTML
    }

    function populateFilms(data) {
        console.log(typeof(data), data)
        if(!data) {
            return
        }
        let html = ''
        data.results.forEach(item => {
            html += `
            <tr>
                <td class="cell_id">${item.id}</td>
                <td>${item.title}</td>
                <td>${item.release_date}</td>
                <td>${item.adults ? 'Yes' : 'No'}</td>
                <td>${item.popularity}</td>
            </tr>`
        })
        document.querySelector('div.films').classList.remove('novisibility')
        document.querySelector('table.table_films tbody')
            .innerHTML = html

        document.querySelectorAll('.cell_id').forEach(
            item => item.addEventListener('click', onClickOneFilm)
        )
    }

    function goToPage(n) {
        filmsPage += n
        loadFilms()
        if (filmsPage > 1) {
            btnprev.classList.remove('novisibility')
        } else {
            btnprev.classList.add('novisibility')
        }


    }

}

document.addEventListener('DOMContentLoaded', main)