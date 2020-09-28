export const templHeader = {
    render: (page) => {
        let menu
        switch (page) {
            case 'login.html':
                menu = `
                    <li><a href="./registro.html">Registro</a></li>
                    <li><a href="./index.html">Inicio</a></li>
                    <li><a href="./about.html">Acerca de</a></li>`
                break
            case 'registro.html':
                menu = `
                    <li><a href="./index.html">Inicio</a></li>
                    <li><a href="./login.html">Login</a></li>
                    <li><a href="./about.html">Acerca de</a></li>`
                break
            case 'usuario.html':
                menu = `                
                    <li><a href="./juegos.html">Juegos</a></li>
                    <li><a href="./apis.html">APIS</a></li>
                    <li><a href="./index.html">Logout</a></li>`
                break
            case 'juegos.html':
                menu = `                
                    <li><a href="./usuario.html">Usuario</a></li>
                    <li><a href="./apis.html">APIS</a></li>
                    <li><a href="./index.html">Logout</a></li>`
                break
            case 'apis.html':
                menu = `                
                    <li><a href="./usuario.html">Usuario</a></li>
                    <li><a href="./juegos.html">Juegos</a></li>
                    <li><a href="./index.html">Logout</a></li>`
                break               
            default:
                menu = `
                    <li><a href="./registro.html">Registro</a></li>
                    <li><a href="./login.html">Login</a></li>
                    <li><a href="./about.html">Acerca de</a></li>`
                break
        }
        return `
            <div class="menu">
                <ul>${menu}</ul>
            </div>
            <h1>Curso JS</h1>`
    }
} 