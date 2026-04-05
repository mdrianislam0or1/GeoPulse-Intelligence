curl --location 'http://localhost:8040/api/v1/auth/register' \
--header 'Content-Type: application/json' \
--header 'Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWEyODcwMmUyNjJkOThhOWFmODk2NWIiLCJpYXQiOjE3NzIzODUxMjcsImV4cCI6MTc4OTY2NTEyN30.kHpr74P5SRyklSAxF_GBUsqdDk9REK1lABc3Mc8Vbgs' \
--data-raw '{
  "name": "Admin User",
  "email": "admin@acme1.com",
  "password": "Admin@123456"
}'


{
    "success": true,
    "data": {
        "status": true,
        "message": "Registration successful",
        "data": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YWQ3YjRlNGIyZTg1MTg2NGQ5YzM1NCIsImVtYWlsIjoiYWRtaW5AYWNtZTEuY29tIiwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjpudWxsLCJ0ZW5hbnQiOm51bGwsImlhdCI6MTc3Mjk3Njk3NCwiZXhwIjoxNzcyOTc3ODc0fQ.ph25pgq4E1Dj724K_W2xMkv4QRtkYOqCDvixo9Amys0",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YWQ3YjRlNGIyZTg1MTg2NGQ5YzM1NCIsImlhdCI6MTc3Mjk3Njk3NCwiZXhwIjoxNzczNTgxNzc0fQ.uVSkG6C8eB4UmUtV6sb7aoFRUEB_9ovYeAcbOoPQZA0",
            "user": {
                "name": "Admin User",
                "email": "admin@acme1.com",
                "phone": "",
                "avatar": "",
                "role": null,
                "tenant": null,
                "status": "active",
                "_id": "69ad7b4e4b2e851864d9c354",
                "createdAt": "2026-03-08T13:36:14.368Z",
                "updatedAt": "2026-03-08T13:36:14.368Z",
                "id": "69ad7b4e4b2e851864d9c354"
            }
        },
        "serverTime": "2026-03-08T13:36:14.587Z",
        "localTime": "2026-03-08T19:36:14.587Z"
    },
    "timestamp": "2026-03-08T13:36:14.587Z"
}




curl --location 'http://localhost:8040/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--header 'Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWEyODcwMmUyNjJkOThhOWFmODk2NWIiLCJpYXQiOjE3NzIzODUxMjcsImV4cCI6MTc4OTY2NTEyN30.kHpr74P5SRyklSAxF_GBUsqdDk9REK1lABc3Mc8Vbgs' \
--data-raw '{
  "email": "admin@acme.com",
  "password": "Admin@123456"
}'



{
    "success": true,
    "data": {
        "status": true,
        "message": "Login successful",
        "data": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YThmZjNjM2QyNGU0N2Q0N2Y4YWVlMCIsImVtYWlsIjoiYWRtaW5AYWNtZS5jb20iLCJuYW1lIjoiVXBkYXRlZCBBZG1pbiIsInJvbGUiOm51bGwsInRlbmFudCI6bnVsbCwiaWF0IjoxNzcyOTc2OTkxLCJleHAiOjE3NzI5Nzc4OTF9.RarPTIA0k_ptrLiQf6VQnZjwJQ8vka5cu5ZY508VN3M",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YThmZjNjM2QyNGU0N2Q0N2Y4YWVlMCIsImlhdCI6MTc3Mjk3Njk5MSwiZXhwIjoxNzczNTgxNzkxfQ.Xl6So7u25o9bf1BzMJDYgLtL7sfo58qrls6TqGvISvA",
            "user": {
                "_id": "69a8ff3c3d24e47d47f8aee0",
                "name": "Updated Admin",
                "email": "admin@acme.com",
                "phone": "01716123465",
                "avatar": "",
                "role": null,
                "tenant": null,
                "status": "active",
                "createdAt": "2026-03-05T03:57:48.277Z",
                "updatedAt": "2026-03-08T13:32:31.994Z",
                "id": "69a8ff3c3d24e47d47f8aee0"
            }
        },
        "serverTime": "2026-03-08T13:36:31.712Z",
        "localTime": "2026-03-08T19:36:31.712Z"
    },
    "timestamp": "2026-03-08T13:36:31.712Z"
}



curl --location --request POST 'http://localhost:8040/api/v1/auth/logout' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw' \
--header 'Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWEyODcwMmUyNjJkOThhOWFmODk2NWIiLCJpYXQiOjE3NzIzODUxMjcsImV4cCI6MTc4OTY2NTEyN30.kHpr74P5SRyklSAxF_GBUsqdDk9REK1lABc3Mc8Vbgs'



{
    "success": true,
    "data": {
        "status": true,
        "message": "Logged out",
        "data": {
            "message": "Logged out successfully"
        },
        "serverTime": "2026-03-08T13:33:04.611Z",
        "localTime": "2026-03-08T19:33:04.611Z"
    },
    "timestamp": "2026-03-08T13:33:04.611Z"
}



curl --location 'http://localhost:8040/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--header 'Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWEyODcwMmUyNjJkOThhOWFmODk2NWIiLCJpYXQiOjE3NzIzODUxMjcsImV4cCI6MTc4OTY2NTEyN30.kHpr74P5SRyklSAxF_GBUsqdDk9REK1lABc3Mc8Vbgs' \
--data-raw '{
  "email": "wrong@example.com",
  "password": "wrong"
}'

{
    "message": [
        "password must be longer than or equal to 6 characters"
    ],
    "error": "Bad Request",
    "statusCode": 400
}


curl --location 'http://localhost:8040/api/v1/auth/register' \
--header 'Content-Type: application/json' \
--header 'Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWEyODcwMmUyNjJkOThhOWFmODk2NWIiLCJpYXQiOjE3NzIzODUxMjcsImV4cCI6MTc4OTY2NTEyN30.kHpr74P5SRyklSAxF_GBUsqdDk9REK1lABc3Mc8Vbgs' \
--data-raw '{
  "email": "test@test.com"
}'


{
    "message": [
        "name should not be empty",
        "name must be a string",
        "password must be longer than or equal to 6 characters",
        "password should not be empty",
        "password must be a string"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
