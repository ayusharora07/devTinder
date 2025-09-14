## authRouter
- POST signup
- POST login
- POST logout

## profileRouter
- PATCH /profile/edit         basically for changing other things on your profile
- GET /profile/view
- PATCH /profile/password     basically for changing your profile password and different from edit bcoz of diff logic

## connectionRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/rejected/:requestId
- POST /request/review/accepted/:requestId

## userRouter

- GET /user/connection
- GET /user/requests
- GET /user/feed        // it basically gets you the profile of other users on your platform


Status:ignore,interested,accept,reject
