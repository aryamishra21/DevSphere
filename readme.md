- npm init
- npm i mongodb
- npm i express
- created server using express
- created cluster on mongodb website 
- get connection string
- create db in mongoDB compass 
- npm i mongoose
- connect to database 'connectionURL'/dbname before starting server
- created user schema
- created signup API, made it dynamic to recieve data from end user
- created read, delete, update user API 
- Data sanitizing - added Schema(DB), API level validations, timestamp, validator lib, bcrypt for password hashing
- Login API with validations
- installed cookie-parser, jsonwebtoken, create jwt token,set secret info, send it to user on login successful
- read cookies in profile api and find the logged in user
- userAuth middleware and used it in profile api, set expiry for jwt token and cookie
- moved method to compare and create jwt token to userSchema methods.
- added routes and categorized apis in routes and auth, profile route apis complete
- created connectionrequestSchema, API , used logical $or query, index(compound index), schema.pre("save")
- request send/review api, userRouter, request/received request/connections api, ref, populate
- user/feed api with logical operators like $nin (not in) $ne (not equals), pagination with skip, limit, request query
- fixed cors restriction added domain , withCredentials for cookies


# APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET profile/view
- PATCH profile/edit
- PATCH profile/password

## connectionRequestRouter
Status:- ignore, interested, accepted, rejected
- POST request/send/:status/:userId       // interested or ignored
- POST request/review/:status/:requestId  // accepted or rejected

## userRouter
- GET user/connections
- GET user/feed
- GET user/requests