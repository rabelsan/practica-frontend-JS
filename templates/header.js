export const templHeader = {
    render: (page) => {
        let title
        let menu
        switch (page) {
            case 'Signin.html':
                title = 'BillboardJS - Sign in'
                menu = `
                    <li><a href="./signup.html">Sign up</a></li>
                    <li><a href="./index.html">Home</a></li>`
                break
            case 'signup.html':
                title = 'BillboardJS - Sign up'
                menu = `
                    <li><a href="./index.html">Home</a></li>
                    <li><a href="./login.html">Login</a></li>`
                break
            case 'films.html':
                title = 'BillboardJS - Films'
                menu = `                
                    <li><a href="./index.html">Logout</a></li>`
                break
            case 'apis.html':
                menu = `                
                    <li><a href="./films.html">films</a></li>
                    <li><a href="./index.html">Logout</a></li>`
                break               
            default:
                title = 'BillBoardJS - Home'
                menu = `
                    <li><a href="./signup.html">Sign up</a></li>
                    <li><a href="./login.html">Login</a></li>`
                break
        }
        return `
            <h1>${title}</h1>
            <div class="menu">
                <p id="loggeduser"></p>
                <ul>${menu}</ul>
            </div>`
    }
} 