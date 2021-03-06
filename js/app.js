import { templFooter } from '../templates/footer.js'
import { templHeader } from '../templates/header.js'
import { KEY } from './config.js'
import { loadSelectByAPI, setSelectItems } from './tools.js'

/**
* Contains all JavaScript code used by this site.
*/
function main() {
    //Spanish provinces list. To be replace by API request if available
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
    const btnprev1 = document.querySelector('#prev1')
    const btnnext1 = document.querySelector('#next1')  
    const btnprev2 = document.querySelector('#prev2')
    const btnnext2 = document.querySelector('#next2')  
        
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
        btnprev1.addEventListener('click', () => {goToPage(-1)})
        btnnext1.addEventListener('click', () => {goToPage(+1)})
        btnprev2.addEventListener('click', () => {goToPage(-1)})
        btnnext2.addEventListener('click', () => {goToPage(+1)})
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

    /**
    * Removes session user information from window.sessionStorage object 
    * when user press Logout menu option. 
    **/
    function onClickLogout () {
        window.sessionStorage.removeItem(storeSessionUser)
    }

    /**
    * Validates user login data.
    * Allow access to users previously registered and saves logged user data into the window.sessionStorage object. 
    **/
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

    /**
    * Hides element with ID '#error_msg' when a from element receives the focus.
    * '#error_msg' is used to show validation errors.
    * @param {Object} form DOM Form object 
    **/
    function onFocusManager(form) {
        form.querySelector('#error_msg').classList.add('novisibility')
    }

    /**
    * Change event manager for county select element.
    * For Spain, it displays the provinces select item. For other countries it is not required.
    * @param {Object} ev Target event object 
    **/
    function onCountryChange(ev) {
        if (ev.srcElement.options[ev.srcElement.selectedIndex].value === 'Spain') {
            frmReg.querySelector('#d_provinces').classList.remove('nodisplay')
        } else {
            frmReg.querySelector('#s_provinces').selectedIndex=0
            frmReg.querySelector('#d_provinces').classList.add('nodisplay')
        }
    }

    /**
    * Validation of the user api-key for https://api.themoviedb.org.
    * If the api-key is correct, validAPIKey var is set to true, otherwise, its value will be false.
    * @param {Object} form DOM Form object 
    * @see 'validAPIKey' variable
    **/
    function onAPIKeyChange(ev) {

        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${ev.srcElement.value}&page=1`   
        fetch(url)
        .then(resp => {
            if (resp.status < 200 || resp.status > 299) {                   
                //error 401 invalid apikey
                validAPIKey = false
            } else {
                validAPIKey = true 
            }    
        }).catch(error => {console.log(error.message)})
    }

    /**
    * Invokes function validateForm() in order to validate all user register data.
    * If valid, onClickSignUp() saves the user data in window.localStorage object
    * and redirects the users to the ./login.html page.
    * Otherwise, it requests again all wrong items. 
    **/
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

    /**
    * Validates all form items and generates a customized error management
    * @para {object} form DOM form object
    * @see '#error_msg' ID
    **/
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

    /**
    * Requests to the API https://api.themoviedb.org a films list sorting and filtering as user has requested. 
    * See query string parameters:
    * @see 'api_key' 
    * @see 'language' 
    * @see 'sort_by' 
    * @see 'include_adult' 
    * @see 'page' parameter and 'filmsPage' variable
    **/
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

    /**
    * Requests to the API https://api.themoviedb.org details of the film clicked by user. 
    * It the film details are alredy displayed, this functions hides them, otherwise it shows 
    * the film image and the synopsis.
    * @see 'ID' column event handler 
    **/
    function onClickOneFilm(ev) {
        if (document.querySelector('.tr_' + ev.srcElement.textContent).classList.contains('nodisplay')) {
            let logUser = window.sessionStorage.getItem(storeSessionUser) ? 
                            JSON.parse(window.sessionStorage.getItem(storeSessionUser)) : []
            let url = `https://api.themoviedb.org/3/movie/${ev.srcElement.textContent}?api_key=${logUser.apikey}&language=${navigator.language}`   
        
            fetch(url)
            .then( resp => {
                if (resp.status < 200 || resp.status >= 300) {
                    //console.log(resp.statusText)
                    throw new Error('HTTP Error ' + resp.status)
                }
                return resp.json()
            })
            .then(data => populateFilmDetails(data))
            .catch (error => alert(error.message))
        } else {
            document.querySelector('.tr_' + ev.srcElement.textContent).classList.add('nodisplay')   
        }
    }

    /**
    * Shows the select film details provided by the API https://api.themoviedb.org. 
    * @param {Object} data Data object array of the movie
    **/
    function populateFilmDetails(data) {
        console.log(data.poster_path)
        console.log(data.overview)
        document.querySelector('.td_img_' + data.id).innerHTML = "<img src=\"https://image.tmdb.org/t/p/original" + data.poster_path +"\" width=150 height=200>"
        document.querySelector('.td_syn_' + data.id).innerHTML = data.overview
        document.querySelector('.tr_' + data.id).classList.remove('nodisplay')
    }

    /**
    * Populates the films list details provided by the API https://api.themoviedb.org. 
    * @param {Object} data Films data object array (20 items per request)
    **/
    function populateFilms(data) {
        if(!data) {
            return
        }
        let html = ''
        data.results.forEach(item => {
            html += `
            <tr class="tr_film">
                <td id="td_id_${item.id}" class="td_id_film"><a href="#td_id_${item.id}" title="Click for details">${item.id}</td>
                <td>${item.title}</td>
                <td>${item.release_date}</td>
                <td>${item.adults ? 'Yes' : 'No'}</td>
                <td>${item.popularity}</td>
            </tr>
            <tr class="tr_${item.id} nodisplay">
                <td class="td_img_${item.id}"></td>
                <td class="td_syn_${item.id}" colspan="4"></td>
            </tr>`
        })
        document.querySelector('div.films').classList.remove('nodisplay')
        document.querySelector('table.table_films tbody').innerHTML = html
        btnnext1.classList.remove('novisibility')
        btnnext2.classList.remove('novisibility')
        document.querySelectorAll('.td_id_film').forEach(
            item => item.addEventListener('click', onClickOneFilm)
        )
    }

    /**
    * Allows move forward/backward of the current films page selected. 
    * Manage the logic of the buttons Previous and Next and invokes onClickSearch() to refresh data. 
    * @param {number} n Current page selection. See 'filmsPage' variable 
    **/
   function goToPage(n) {
        filmsPage += n
        onClickSearch()
        if (filmsPage > 1) {
            btnprev1.classList.remove('novisibility')
            btnprev2.classList.remove('novisibility')
        } else {
            btnprev1.classList.add('novisibility')
            btnprev2.classList.add('novisibility')
        }
    }
}

document.addEventListener('DOMContentLoaded', main)