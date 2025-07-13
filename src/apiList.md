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
- POST /request/review/accepted/:requestId
- POST /request/review/accepted/:requestId

## userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profile of
