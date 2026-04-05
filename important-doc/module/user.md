curl --location 'http://localhost:8040/api/v1/users?page=1&limit=10' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw'


{
    "success": true,
    "data": {
        "status": true,
        "message": "Users fetched",
        "data": [
            {
                "_id": "69ad7b4e4b2e851864d9c354",
                "name": "Admin User",
                "email": "admin@acme1.com",
                "phone": "",
                "avatar": "",
                "role": null,
                "tenant": null,
                "status": "active",
                "createdAt": "2026-03-08T13:36:14.368Z",
                "updatedAt": "2026-03-08T13:36:14.539Z",
                "id": "69ad7b4e4b2e851864d9c354"
            },
            {
                "_id": "69a8ff3c3d24e47d47f8aee0",
                "name": "Updated Admin",
                "email": "admin@acme.com",
                "phone": "01716123465",
                "avatar": "",
                "role": null,
                "tenant": null,
                "status": "active",
                "createdAt": "2026-03-05T03:57:48.277Z",
                "updatedAt": "2026-03-08T13:36:31.668Z",
                "id": "69a8ff3c3d24e47d47f8aee0"
            },
            {
                "_id": "69a88410956ce666216d8eeb",
                "name": "John Doe",
                "email": "rianislam.coder@gmail.com",
                "phone": "",
                "avatar": "",
                "role": null,
                "tenant": null,
                "status": "active",
                "createdAt": "2026-03-04T19:12:16.337Z",
                "updatedAt": "2026-03-04T19:12:16.439Z",
                "id": "69a88410956ce666216d8eeb"
            },
            {
                "_id": "69a883df956ce666216d8ee7",
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "",
                "avatar": "",
                "role": null,
                "tenant": null,
                "status": "active",
                "createdAt": "2026-03-04T19:11:27.546Z",
                "updatedAt": "2026-03-05T03:56:55.746Z",
                "id": "69a883df956ce666216d8ee7"
            },
            {
                "role": null,
                "tenant": null,
                "_id": "69a66be0b0b4cc0bc1c65f36",
                "name": "Jane Doe",
                "email": "rian@gmail.com",
                "phone": "01712345678",
                "avatar": "https://example.com/avatar.jpg",
                "status": "active",
                "createdAt": "2026-03-03T05:04:33.006Z",
                "updatedAt": "2026-03-03T05:20:56.635Z",
                "id": "69a66be0b0b4cc0bc1c65f36"
            }
        ],
        "total": 5,
        "page": 1,
        "limit": 10,
        "totalPages": 1,
        "serverTime": "2026-03-08T17:38:31.282Z",
        "localTime": "2026-03-08T23:38:31.282Z"
    },
    "timestamp": "2026-03-08T17:38:31.282Z"
}


curl --location 'http://localhost:8040/api/v1/users/69ad7b4e4b2e851864d9c354' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw'


{
    "success": true,
    "data": {
        "status": true,
        "message": "User fetched",
        "data": {
            "_id": "69ad7b4e4b2e851864d9c354",
            "name": "Admin User",
            "email": "admin@acme1.com",
            "phone": "",
            "avatar": "",
            "role": null,
            "tenant": null,
            "status": "active",
            "createdAt": "2026-03-08T13:36:14.368Z",
            "updatedAt": "2026-03-08T13:36:14.539Z",
            "id": "69ad7b4e4b2e851864d9c354"
        },
        "serverTime": "2026-03-08T17:38:26.072Z",
        "localTime": "2026-03-08T23:38:26.073Z"
    },
    "timestamp": "2026-03-08T17:38:26.073Z"
}



curl --location --request PATCH 'http://localhost:8040/api/v1/users/69ad7b4e4b2e851864d9c354' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw' \
--data '{
  "name": "Updated Admin",
  "phone": "01716123465"
}'


{
    "success": true,
    "data": {
        "status": true,
        "message": "User updated",
        "data": {
            "_id": "69ad7b4e4b2e851864d9c354",
            "name": "Updated Admin",
            "email": "admin@acme1.com",
            "phone": "01716123465",
            "avatar": "",
            "role": null,
            "tenant": null,
            "status": "active",
            "createdAt": "2026-03-08T13:36:14.368Z",
            "updatedAt": "2026-03-08T17:40:05.026Z",
            "id": "69ad7b4e4b2e851864d9c354"
        },
        "serverTime": "2026-03-08T17:40:05.090Z",
        "localTime": "2026-03-08T23:40:05.090Z"
    },
    "timestamp": "2026-03-08T17:40:05.090Z"
}




curl --location --request DELETE 'http://localhost:8040/api/v1/api/users/69ad7b4e4b2e851864d9c354' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzIxMjc5NTksImV4cCI6MTc3MjIxNDM1OX0.p2fMeE8X5Dl15OxmZWJoL14ER4tUEctcJR8hpxxHyzc'
