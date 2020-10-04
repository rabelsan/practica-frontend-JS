# Desarrollo frontend con JavaScript

## Install

```sh
npm install -g live-server
```

## Configure environment variables

No config files required since the api-key value is requested during user registration process.

## Usage

```sh
live-server
```

## Principal methods in main() function

### onClickLog()

  Validates user login data (email and password). 
  If credentials are valid, it save user data into the window.sessionStorage object

### onCountryChange(ev)

  Change event manager for county select element.
  For Spain, it displays the provinces select item. For other countries it is not required.
  Parameter 'ev' is the target event object 
 
### onAPIKeyChange(ev)

  Validation of the user api-key for https://api.themoviedb.org.
  See 'validAPIKey' variable usage

### onClickSignUp()
  
  Checks the form validity. If registration data are valid, onClickSignUp() saves the user data in window.localStorage object. it requests again all wrong items. 

  **IMPORTANT!** 
  If the user email was already registered, the function will replace the old data with the new ones.
  In future versions, a correct sing up management procedure should be put in place.

### validateForm(form)

  Form data validation. This function manage data validation for the form element received by parameter.

### onClickSearch() {

  Invokes the discover API of themoviedb.com filtering as sorting as requested by logged user

### onClickOneFilm(ev)

  Shows details (image and synopsis), for the film ID clicked by user (received in 'ev' parameter).
  If details were already displayed previosly, it hides them.

### populateFilms(data)

  Loads the HTML table with the films list received in 'data' parameter

### populateFilmDetails(data)

  Loads the HTML table with the films list received in 'data' parameter

### goToPage(n)

 Page navigation manager. Paramenter received contains the page to be displayed.


## Author

👤 **Ramón Beltrán**

* Github: [@rabelsan](https://github.com/rabelsan)
