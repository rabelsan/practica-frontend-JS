Crear una aplicación con los siguientes componentes
- una página de bienvenida
- una página de registro, donde 
    - cada registro incluye
        - genero (hombre / mujer / otros) (requerido) -> radio Buttons
        - nombre y apellidos (requerido)
        - nacionalidad (español / estrangero) o lista de paises (requerido) -> select 
        - provincia (requerido solo para españoles)
        - movil (requerido)
        - email (requerido)    
        - usuario (requerido)
        - password (requerido)
        - confirmar password (requerido)
        - API_KEY (requerido)       
        - aceptar las condiciones del sitio (requerido) -> check box
        - comentarios -> textarea
    - la información de registro se guarda en localStorage
- una página de login - por usuario / password
    - se comprueban los datos en el registro de localStorage
    
- una página de usuario 
    - se presenta un listado de películas, paginado de 10 en 10
    - se puede acceder al conjunto de los datos de una película

Para obtener el listado de títulos se hace una llamada al API
Para obtener los datos concretos de una película se hace una segunda llamada al API

API: https://developers.themoviedb.org/