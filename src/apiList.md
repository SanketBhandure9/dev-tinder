# DevTinder's APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/:status/:userid
- POST /request/review/:status/:requestId

## userRouter

- GET /user/requests
- GET /user/connections
- GET /user/feed - Gets you the profile of
