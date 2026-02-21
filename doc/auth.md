curl --location 'https://geopulse-inteligence-server.vercel.app/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
 "fullName": "Rian Islam",
    "username": "rianislam",
    "email": "rianislam.dg@gmail.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
}'



response
{"success":true,"statusCode":201,"message":"User registered successfully. Please check your email for verification.","data":{"userId":"69997df064497b2c13c55dfd","fullName":"Rian Islam","username":"rianislam","email":"rianislam.dg@gmail.com","role":"user","isEmailVerified":false}}


curl --location 'https://geopulse-inteligence-server.vercel.app/api/auth/login' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo' \
--data-raw '{
    "email": "rianislam.dg@gmail.com",
    "password": "Password123!"
}'

response
{"success":true,"statusCode":200,"message":"Login successful","data":{"user":{"userId":"69997df064497b2c13c55dfd","email":"rianislam.dg@gmail.com","username":"rianislam","fullName":"Rian Islam","role":"admin","avatar":null},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzE2Nzc3MTEsImV4cCI6MTc3MTc2NDExMX0.Z59yADALDmjWruVo1fgdI-dQOyBa8H8KSwlpuJLYsK4","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzE2Nzc3MTEsImV4cCI6MTc3NDI2OTcxMX0.7bQMLWkmci_AMqOdvu8ruKa_D8IVRloUMNko-HArRjQ","expiresIn":"200d"}}


curl --location 'https://geopulse-inteligence-server.vercel.app/api/auth/forgot-password' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo' \
--data-raw '{
    "email": "rianislam.dg@gmail.com"
}'


{"success":true,"statusCode":200,"message":"If that email is registered you will receive a reset link shortly.","data":null}



curl --location 'https://geopulse-inteligence-server.vercel.app/api/auth/change-password' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo' \
--data '{
     "currentPassword": "NewPassword456!",
    "newPassword": "Password123!",
    "confirmPassword": "Password123!"
}'



{"success":true,"statusCode":200,"message":"Password changed successfully. Please log in again.","data":null}




curl --location --request POST 'https://geopulse-inteligence-server.vercel.app/api/auth/2fa/enable' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


{"success":true,"statusCode":200,"message":"Scan the QR code with your authenticator app, then verify with the 6-digit token.","data":{"secret":"MI5UI4T5IU4CCSBEI5XT4MRFENKHM6ZJ","qrCode":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAklEQVR4AewaftIAAAdtSURBVO3BQY4cy5LAQDLQ978yR0tfJZCoan29GDezP1jrEoe1LnJY6yKHtS5yWOsih7UucljrIoe1LnJY6yKHtS5yWOsih7UucljrIoe1LnJY6yKHtS7yw4WusRhrYsc1rrIYa2LHNa6yGGtixzWushhrYsc1rrIYa2LHNa6yGGtixzWushhrYsc1rrIYa2L/B/yIMSoFEsWHwAAAABJRU5ErkJggg=="}}



curl --location 'https://geopulse-inteligence-server.vercel.app/api/auth/2fa/verify' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo' \
--data '{
    "token": "123456"
}'

response
{"success":false,"message":"Invalid 2FA token"}
