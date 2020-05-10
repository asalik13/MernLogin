# MernLogin
# Simple Login Server implemented in the MERN Stack, Passport.js and NodeMailer

This was built using Material-Ui, the server is hosted on heroku and the client is hosted on netlify.
This can easily be used as a boilerplate for any web app. It has the following routes:


    -Login
    -Register
    -Forgot
    -Reset
    -Verify
    -Secret

The database is hosted on MongoDB Atlas and is also used to manage sessions.


# To setup this project locally, you will have to follow the following steps
- Edit the .env file in Server with the respective values of the variables
- Edit the link variable in Client/src/utils/config.js to that of the backend
- Run 'npm dev'
