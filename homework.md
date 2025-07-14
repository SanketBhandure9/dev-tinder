1. Create Repository
2. Initialize the repository
3. Learn about node_modules, package.json, package-lock.json
4. Install Express
5. Create Server
6. Listen to Port 3000
7. Write request handler for /test, /hello
8. Install nodemon update scripts inside package.json
9. What are dependencies?
10. What is use of "-g" while npm install
11. Difference between caret and tilde (^ vs ~)

12. Initialize git
13. .gitignore
14. Create a remote app on github
15. Push all code to remote origin
16. Play with routes and extensions e.g. /test
17. Order of the routes matter a lot
18. Install postman app and create workspace and collection and make api call using postman
19. Write logic to handle all apis calls (GET, POST, DELETE, etc.)
20. Explore route and use if ?, \*, +, () in the routes
21. Use of regex in routes
22. Reading the query params in the routes
23. Reading the dynamic routes
24. Multiple route handlers - Play with the code
25. next()
26. Next funciton and res.send() together
27. app.use("/route", [r1, r2], r3)
28. What is middleware? Why do we need it?
29. How express JS actually handles the request behind the scenes
30. Difference between app.use and app.all
31. Write dummy auth middleware for admin
32. Write dummy auth middleware for all user rputes except /user/login
33. Error handling using app.use

34. Create a free cluster MongoD official website
35. Install mongoose library
36. Connect your application to database "connection-url"/devTinder
37. Call the connectDB function and connect to database before starting application on 3000
38. Create a userSchema and UserModel
39. Create POST /signup api and add data to database
40. Push some documents usins API calls from postman
41. Error handling using try, catch

42. Javascript object vs JSON
43. Add express json middleware to your app
44. Make your signup api dynamic from postman or client
45. When using findOne for duplicates, which will it returns latest one or oldest one
46. API - Get user by email
47. API - feed api to get all users
48. Create API - get user by id
49. Create API to delete user
50. Difference between PATCH and PUT
51. API - update user
52. Explore mongoose documentation for models
53. What are options in a Model.findOneAndUpdate method
54. Update the user with emailId

55. Schema type options
56. Add require, trim, minlength, maxlength, default, unique, lowercase
57. Add default
58. Create a custom validate function for gender
59. Improve the DB schema - PUT all appropriate validations on each field in schema
60. Add timestamps to the schema
61. API level validation on PATCH request and signup post api
62. Data sanitization: Add API validationfor each field
63. Install validator library
64. Explore validator library functions and use validators funcs for password, email, etc.
65. NEVER TRUST req.body

66. Validate data in signup API
67. Install bcrypt package
68. Create passwordHash using bcrypt.hash and store in database
69. Create login API
70. Compare password and throw error if email or passowrd is not correct

71. Install cookie-parser
72. Send dummy cookie to user
73. Create GET /profile API and check if you get the cookie back
74. Install jsonwebtoken
75. In /login API, after email and password validation, create a JWT token and send it to user in cookie
76. Read the cookies inside your profile API and find who is logged in user
77. Write userAuth middleware
78. Add userAuth to profile API and send new sendConnectionRequest API
79. Set the expiry of JWT token and cookies for 7 days
80. Create userSchema method to getSJWT
81. Create userSchema method to comparePassword

82. Explore tinder APIs
83. Create a list of all APIs you can think of devTinder
84. Group multiple routes
85. Read documentation for express.router
86. Create routes folder for managing routes
87. Creta router authRouter, profileRouter, requestRouter
88. Import these routers in app.js
89. Create POST /logout API
90. Create PATCH /profile/view, /profile/edit and test it
91. Create PATCH /profile/password = >Forget password API
92. Make you validate all data in every POST, PATCH APIs

93. Create connection request schema
94. Send connection request API
95. Proper validation of data
96. Think about all corner cases
97. $or and $and in mongoose
98. Schema.pre()
99. Read more about indexes in mongoDB
100. Why do we need index in DB?
101. What is advanctage and disadvantage of creating index?
102. Read article about mongoDB/mongoose compound indexing

103. Write code with proper validation for POST /reuqest/review/:status/:requestId
104. Thought process: POST vs GET
105. Read about ref and populate
106. Create GET /user/requests/received
