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
    let validAPIKey = false
    
    //DOM nodes
    const frmReg = document.querySelector('#f_register')
    const frmLog =  document.querySelector('#f_login')
    const frmFilms = document.querySelector('#f_films')
    const btnprev = document.querySelector('#prev')
    const btnnext = document.querySelector('#next')  
        
        
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
        frmReg.querySelector('input#i_apikey').addEventListener('change',onAPIKeyChange)
        //Load Selects
        loadSelectByAPI('https://restcountries.eu/rest/v2/all', 's_countries')
        setSelectItems('s_provinces', SPProvinces)
    }
    
    if (frmFilms) {
        btnprev.addEventListener('click', () => {goToPage(-1)})
        btnnext.addEventListener('click', () => {goToPage(+1)})
        frmFilms.querySelector('#b_search').addEventListener('click', onClickSearch)
    }

    //Header-Footer setup 
    const posicion = window.location.pathname.lastIndexOf('/') + 1
    const page = window.location.pathname.slice(posicion)
    document.querySelector('header').innerHTML = templHeader.render(page)
    if (frmFilms) {
        document.querySelectorAll('a#logout')[0].addEventListener('click', onClickLogout)
        document.querySelector('p#loguser').innerHTML = window.sessionStorage.getItem(storeSessionUser) ?
            `Welcome ${JSON.parse(window.sessionStorage.getItem(storeSessionUser)).name}` : ''
    
    }
    const hoy = (new Date()).toLocaleDateString()
    document.querySelector('footer').innerHTML =  templFooter.render(hoy)

    function onClickLogout () {
        window.sessionStorage.removeItem(storeSessionUser)
    }

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
            //Save logged user in session storage 
            window.sessionStorage.removeItem(storeSessionUser)
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

    function onAPIKeyChange(ev) {

        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${ev.srcElement.value}&page=1`   
        fetch(url)
        .then(resp => {
            if (resp.status < 200 || resp.status > 299) {                   
                //throw new Error('HTTP Error ' + resp.status)
                return []
            }
            return resp.json()
        }).catch(error => {console.log(error.message)})
        .then(data => { 
            if (data) {validAPIKey=true}
         })
        .catch (error => {console.log(error.message)})
    }

    function onClickSignUp()  {
        //const frmReg = document.querySelector('#f_register')
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
        //Passwords matching validation
        if (frmReg.querySelector('#i_passwd1').value !== frmReg.querySelector('#i_passwd2').value) {
            frmReg.querySelector('#error_msg').classList.remove('novisibility')
            frmReg.querySelector('#error_msg').innerHTML = 'Password confirmation do not match'
            return
        }    
        //Check API validity
        if (!validAPIKey) {
            frmReg.querySelector('#error_msg').classList.remove('novisibility')
            frmReg.querySelector('#error_msg').innerHTML = 'The key is not valid for themoviedb API'
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
            mobile : frmReg.querySelector('#i_mobile').value,
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
                case 'i_mobile':
                        errorMsg = 'A valid mobile is required'
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
                    errorMsg = 'Password must contain numbers and letters, 4-10 characters'  
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

    function onClickSearch() {
        const rSortBy = [...frmFilms.querySelectorAll('[name="sort"]')]
        const rSortByDir = [...frmFilms.querySelectorAll('[name="sortdir"]')]
        let sortBy = rSortBy.filter(item => item.checked)[0].value
        let sortByDir = rSortByDir.filter(item => item.checked)[0].value
        let adults = frmFilms.querySelector('#c_adults').checked ? "true" : "false"
        let logUser = window.sessionStorage.getItem(storeSessionUser) ? 
                        JSON.parse(window.sessionStorage.getItem(storeSessionUser)) : []
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${logUser.apikey}&language=${navigator.language}&sort_by=${sortBy}.${sortByDir}&include_adult=${adults}&include_video=false`   
        if (filmsPage > 1) {
            url += '&page=' + filmsPage
        } 

        if (!logUser) {
            alert('Internal error: loguser not valid!')
            return
        }
        
        fetch(url)
        .then( resp => {
            if (resp.status < 200 || resp.status >= 300) {
                //console.log(resp.statusText)
                throw new Error('HTTP Error ' + resp.status)
            }
            return resp.json()
        })
        .then(data => populateFilms(data))
        .catch (error => alert(error.message))
    }

    function onClickOneFilm(ev) {
        let url = 'https://api-v3.igdb.com/games?fields=*&id='
        url += ev.target.innerHTML
    }

    function populateFilms(data) {
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
        document.querySelector('div.films').classList.remove('nodisplay')
        document.querySelector('table.table_films tbody').innerHTML = html
        btnnext.classList.remove('novisibility')
        document.querySelectorAll('.cell_id').forEach(
            item => item.addEventListener('click', onClickOneFilm)
        )
    }

    function goToPage(n) {
        filmsPage += n
        onClickSearch()
        if (filmsPage > 1) {
            btnprev.classList.remove('novisibility')
        } else {
            btnprev.classList.add('novisibility')
        }
    }
}

document.addEventListener('DOMContentLoaded', main)