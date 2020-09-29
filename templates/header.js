export const templHeader = {
    render: (page) => {
        let title
        let menu
        switch (page) {
            case 'Sign In.html':
                title = 'BillboardJS - Sign in'
                menu = `
                    <li><a href="./signup.html">Sign up</a></li>
                    <li><a href="./index.html">Home</a></li>`
                break
            case 'signup.html':
                title = 'BillboardJS - Sign up'
                menu = `
                    <li><a href="./index.html">Home</a></li>
                    <li><a href="./Login.html">Login</a></li>`
                break
            case 'user.html':
                title = 'BillboardJS - User'
                menu = `                
                    <li><a href="./films.html">films</a></li>
                    <li><a href="./apis.html">APIS</a></li>`
                break
            case 'films.html':
                title = 'BillboardJS - Films'
                menu = `                
                    <li><a href="./user.html">user</a></li>
                    <li><a href="./apis.html">APIS</a></li>`
                break
            case 'apis.html':
                menu = `                
                    <li><a href="./user.html">user</a></li>
                    <li><a href="./films.html">films</a></li>
                    <li><a href="./index.html">Logout</a></li>`
                break               
            default:
                title = 'BillBoardJS - Home'
                menu = `
                    <li><a href="./signup.html">Sign up</a></li>
                    <li><a href="./Login.html">Login</a></li>`
                break
        }
        return `
            <h1>${title}</h1>
            <div class="menu">
                <ul>${menu}</ul>
            </div>`
    }
} 