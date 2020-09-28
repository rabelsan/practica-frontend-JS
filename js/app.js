import { templFooter } from '../templates/footer.js'
import { templHeader } from '../templates/header.js'
import { KEY } from './config.js'
import { setSelectStrins } from './tools.js'

function main() {
    let nodoKey
    let gamesPage = 1
    const storeUsers = 'usuarios'
    const btnLog =  document.querySelector('#b_acceder')
    const btnReg =  document.querySelector('#b_registrar')
    const btnGeo = document.querySelector('#geo button')
    const btnLoad = document.querySelector('#b_load_paises')
    const btnSearch = document.querySelector('#b_libros')
    const btnGames = document.querySelector('#b_load_games')
    const btnprev = document.querySelector('#prev')
    const btnnext = document.querySelector('#next')

    const aQuestions = document.querySelectorAll('.question')

    if(btnLog) {
        btnLog.addEventListener('click', onClickLog)
    }
    if (btnReg) {
        btnReg.addEventListener('click', onClickReg)
    }
    if (btnGeo) {
        btnGeo.addEventListener('click', onClickGeo)
    }
    if (aQuestions) {
        aQuestions.forEach(
            item => item.addEventListener('click', onClickQuestion)
        )
    }
    if(btnLoad) {
        btnLoad.addEventListener('click', onClickLoad)
    }
    if(btnSearch){
        btnSearch.addEventListener('click', onClickSearch)
    }
    if(btnGames) {
        btnGames.addEventListener('click', onClickGames)
        nodoKey = document.querySelector('#api_key')
        nodoKey.value = KEY
        btnprev.addEventListener('click', () => {goToPage(-1)})
        btnnext.addEventListener('click', () => {goToPage(+1)})
    }


    const hoy = (new Date()).toLocaleDateString()
    document.querySelector('footer').innerHTML =  templFooter.render(hoy)

    const posicion = window.location.pathname.lastIndexOf('/') + 1
    const page = window.location.pathname.slice(posicion)
    document.querySelector('header').innerHTML = templHeader.render(page)

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
            
            // Ejemplo del uso de los metodos open(), close() y setTimeout()
            // del objeto window 
            
            /* const handler = window.open('usuario.html')
            setTimeout(()=>{
                handler.close()
            }, 2000) */
        }
    }

    function onClickReg ()  {
        const formReg = document.querySelector('#f_register')
        if (!validarForm(formReg)) {
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

    function validarForm(form) {
        const inputs = [...form.querySelectorAll('input')]
        try {
            inputs.forEach((item) => {
                if(!item.value) {
                    const error = new Error(`Campo ${item.id} invalido`)
                    error.code = item.id
                    throw error
                }
            })
            return true  
        } catch (error) {
            console.log(error.message)
            console.log(error.code)
            // let input = confirm(error.message)
            // alert(input)
            let errorMsg
            /* switch (error.message) {
                case 'Campo i_nombre invalido':
                    errorMsg = 'El nombre es obligatorio'
                    break;
                case 'Campo i_passwd invalido':
                    errorMsg = 'La password es obligatoria'
                    break;
                default:
                    errorMsg = 'Se ha produido un error'
                    break;
            } */

            switch (error.code) {
                case 'i_nombre':
                    errorMsg = 'El nombre es obligatorio'
                    break;
                case 'i_passwd':
                    errorMsg = 'La password es obligatoria'
                    break;
                default:
                    errorMsg = 'Se ha produido un error'
                    break;
            }

            form.querySelector('p').innerHTML = errorMsg
            return false
        }

    }

    function onClickGeo() {
        navigator.geolocation.getCurrentPosition(
            (position)=>{
                let size = 1.4
                console.log(position)
                const geoDiv = document.querySelector('#geo div').cloneNode()
                geoDiv.title += ' del Nodo Clonado'
                geoDiv.removeAttribute('hidden')
                // geoDiv.style = "{font-size="+size+"rem}"
                geoDiv.style.fontSize = size + "rem"
                console.log(geoDiv)
                console.dir(geoDiv)
                geoDiv.innerHTML = `
                <p>Latitud ${position.coords.latitude} </p>
                <p>Longitud ${position.coords.longitude}</p>
                `
                document.querySelector('#geo').appendChild(geoDiv)
                initMap({lat: position.coords.latitude, lng:position.coords.longitude})
            }, 
            (error)=>{
                console.log(error)
            })
    }

    function initMap(point = {lat: 52, lng: 0}) {
        const map = new google.maps.Map(
            document.querySelector('.map'),
            {zoom: 8, center: point}
        )
        const marker = new google.maps.Marker(
            {position: point, map: map}
        )
    }

    function onClickQuestion(ev) {
        console.log(ev.target.id)
        document.querySelectorAll('.response').forEach(
            item => item.classList.add('nodisplay')
        )
        ev.target.nextElementSibling.classList.remove('nodisplay')
    }

    function onClickLoad() {
        const method = 'GET'
        const url = 'https://restcountries.eu/rest/v2/all'   
        // https://restcountries.eu/rest/v2/name/{}
        /* const http = new XMLHttpRequest()
        console.log(http)
        http.onreadystatechange = ajaxCallback
        http.addEventListener('readystatechange', ajaxCallback)
        http.open(method, url)
        http.send(null) */

        // fetch
        // axios

        fetch(url)
        .then( resp => {
            console.log(resp)
            if (resp.status < 200 || resp.status >= 300) {
                console.log(resp.statusText)
                throw new Error('HTTP Error ' + resp.status)
            }
            return resp.json()
        })
        .then( data =>  procesarPaises(data))
        .catch (error => alert(error.message))
    }

    function procesarPaises(data) {
        console.log(data)
        const paises = data.map(item => item.name)
        console.log(paises)
        setSelectStrins('paises', paises )
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
        if (gamesPage > 1) {
            url += '&offset=' + 10*(gamesPage-1)
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
        gamesPage += n
        onClickGames()
        if (gamesPage > 1) {
            btnprev.classList.remove('ocultar')
        } else {
            btnprev.classList.add('ocultar')
        }


    }

}

document.addEventListener('DOMContentLoaded', main)