curl --location 'http://localhost:8040/api/v1/auth/send-otp' \
--header 'Content-Type: application/json' \
--data-raw '{
  "phone": "01794193425",
  "email":"rianislam.dg@gmail.com",
  "purpose": "login"
}'

response
"{
    "success": true,
    "statusCode": 200,
    "message": "OTP sent successfully. Valid for 5 minutes.",
    "data": {
        "messageBn": "OTP পাঠানো হয়েছে। ৫ মিনিট বৈধ।",
        "_devNote": "Check server logs for OTP"
    }
}"


"curl --location 'http://localhost:8040/api/v1/auth/verify-otp' \
--header 'Content-Type: application/json' \
--data '{
  "phone": "01794193425",
  "otp": "226324",
  "purpose": "login"
}'"
response
"{
    "success": true,
    "statusCode": 200,
    "message": "Login successful.",
    "data": {
        "user": {
            "userId": "69ca585f1ee988d31c30b2b9",
            "phone": "01794193425",
            "name": "Updated Name",
            "role": "superadmin",
            "status": "pending_kyc",
            "avatar": "https://i.ibb.co/fYSrYnZH/5f3d328bcb0e.jpg",
            "isPhoneVerified": true,
            "preferredLanguage": "bn"
        },
        "tokens": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWNhNTg1ZjFlZTk4OGQzMWMzMGIyYjkiLCJwaG9uZSI6IjAxNzk0MTkzNDI1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJzdGF0dXMiOiJwZW5kaW5nX2t5YyIsImp0aSI6ImEzMmQ2M2FmLTUwMzctNDQ5Yy1hMmUyLWJhMGQ0ZGMwOTBlZCIsImlhdCI6MTc3NTMxMTY0NCwiZXhwIjoxODA0NDI4NDQ0fQ.cLEQc7pNahwqICzg1dJuyZCk3SaFgYx2iVGohSGcAHc",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWNhNTg1ZjFlZTk4OGQzMWMzMGIyYjkiLCJwaG9uZSI6IjAxNzk0MTkzNDI1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJzdGF0dXMiOiJwZW5kaW5nX2t5YyIsImp0aSI6IjcxOGQ3ZGVmLWY2MGItNDFlMy1iNjI3LWExZDMxZWRmMTEyMiIsImlhdCI6MTc3NTMxMTY0NCwiZXhwIjoxODA0NDI4NDQ0fQ.mQFJxTuE6udthaAtE9xNYB-jImiuQKiIRixAHwkGQ9U",
            "expiresIn": "337d"
        }
    }
}"

for registration
"curl --location 'http://localhost:8040/api/v1/auth/send-otp' \
--header 'Content-Type: application/json' \
--data-raw '{
  "phone": "01871269350",
  "email":"rianislam.coder@gmail.com",
  "purpose": "register"
}'"

"{
    "success": true,
    "statusCode": 200,
    "message": "OTP sent successfully. Valid for 5 minutes.",
    "data": {
        "messageBn": "OTP পাঠানো হয়েছে। ৫ মিনিট বৈধ।",
        "_devNote": "Check server logs for OTP"
    }
}"


curl --location 'http://localhost:8040/api/v1/auth/verify-otp' \
--header 'Content-Type: application/json' \
--data '{
  "phone": "01871269350",
  "otp": "857853",
  "purpose": "register",
  "name": "Test Farmer",
  "role": "farmer",
  "fcmToken": "test-fcm-token"
}'

registraion
"{
    "success": true,
    "statusCode": 200,
    "message": "Registration successful. Please complete KYC to activate full features.",
    "data": {
        "user": {
            "userId": "69d12a41e3944ae6b5f298a5",
            "phone": "01871269350",
            "name": "Test Farmer",
            "role": "farmer",
            "status": "pending_kyc",
            "isPhoneVerified": true,
            "preferredLanguage": "bn"
        },
        "tokens": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMmE0MWUzOTQ0YWU2YjVmMjk4YTUiLCJwaG9uZSI6IjAxODcxMjY5MzUwIiwicm9sZSI6ImZhcm1lciIsInN0YXR1cyI6InBlbmRpbmdfa3ljIiwianRpIjoiMGFjOWI5ZDUtZGIxYi00OTA1LWI3MTctMzEzNDA4ZTliZDFjIiwiaWF0IjoxNzc1MzE1NTIxLCJleHAiOjE4MDQ0MzIzMjF9.HOYURbGU0cSVC5gcApdS-bl2jCqRMUgjU4YwztG1r5I",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMmE0MWUzOTQ0YWU2YjVmMjk4YTUiLCJwaG9uZSI6IjAxODcxMjY5MzUwIiwicm9sZSI6ImZhcm1lciIsInN0YXR1cyI6InBlbmRpbmdfa3ljIiwianRpIjoiMjE4NGE4YzMtYmYwYS00MDJiLTgyYzktZDk1NzM4YTMwOGJiIiwiaWF0IjoxNzc1MzE1NTIxLCJleHAiOjE4MDQ0MzIzMjF9.MPIpxmQ3Yf-xnsfHQ8M6ckW3anCWR7h8MTXtCzNPSfE",
            "expiresIn": "337d"
        }
    }
}"


"curl --location 'http://localhost:8040/api/v1/auth/refresh-token' \
--header 'Content-Type: application/json' \
--data '{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMmE0MWUzOTQ0YWU2YjVmMjk4YTUiLCJwaG9uZSI6IjAxODcxMjY5MzUwIiwicm9sZSI6ImZhcm1lciIsInN0YXR1cyI6InBlbmRpbmdfa3ljIiwianRpIjoiMjE4NGE4YzMtYmYwYS00MDJiLTgyYzktZDk1NzM4YTMwOGJiIiwiaWF0IjoxNzc1MzE1NTIxLCJleHAiOjE4MDQ0MzIzMjF9.MPIpxmQ3Yf-xnsfHQ8M6ckW3anCWR7h8MTXtCzNPSfE"
}'"


"{
    "success": true,
    "statusCode": 200,
    "message": "Access token refreshed.",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMmE0MWUzOTQ0YWU2YjVmMjk4YTUiLCJwaG9uZSI6IjAxODcxMjY5MzUwIiwicm9sZSI6ImZhcm1lciIsInN0YXR1cyI6InBlbmRpbmdfa3ljIiwianRpIjoiNzNmY2YwMjAtODJlMC00OTkzLTk5OGQtN2Y2MDliN2JiYmY5IiwiaWF0IjoxNzc1MzE1NTY5LCJleHAiOjE4MDQ0MzIzNjl9.z_0JTXmwGT-XllV0VroPolAKnfns2zNhi8kRJ9Yi2g8",
        "expiresIn": "337d"
    }
}"


"curl --location 'http://localhost:8040/api/v1/auth/me' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMmE0MWUzOTQ0YWU2YjVmMjk4YTUiLCJwaG9uZSI6IjAxODcxMjY5MzUwIiwicm9sZSI6ImZhcm1lciIsInN0YXR1cyI6InBlbmRpbmdfa3ljIiwianRpIjoiNzNmY2YwMjAtODJlMC00OTkzLTk5OGQtN2Y2MDliN2JiYmY5IiwiaWF0IjoxNzc1MzE1NTY5LCJleHAiOjE4MDQ0MzIzNjl9.z_0JTXmwGT-XllV0VroPolAKnfns2zNhi8kRJ9Yi2g8'"

respnse
"{
    "success": true,
    "statusCode": 200,
    "message": "Profile fetched successfully.",
    "data": {
        "_id": "69d12a41e3944ae6b5f298a5",
        "phone": "01871269350",
        "name": "Test Farmer",
        "role": "farmer",
        "status": "pending_kyc",
        "fcmToken": "test-fcm-token",
        "preferredLanguage": "bn",
        "isPhoneVerified": true,
        "isEmailVerified": false,
        "loginAttempts": 0,
        "createdAt": "2026-04-04T15:12:01.266Z",
        "updatedAt": "2026-04-04T15:12:01.909Z",
        "lastLoginAt": "2026-04-04T15:12:01.909Z",
        "id": "69d12a41e3944ae6b5f298a5"
    }
}"

update profile

"curl --location --request PATCH 'http://localhost:8040/api/v1/auth/me' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMmE0MWUzOTQ0YWU2YjVmMjk4YTUiLCJwaG9uZSI6IjAxODcxMjY5MzUwIiwicm9sZSI6ImZhcm1lciIsInN0YXR1cyI6InBlbmRpbmdfa3ljIiwianRpIjoiNzNmY2YwMjAtODJlMC00OTkzLTk5OGQtN2Y2MDliN2JiYmY5IiwiaWF0IjoxNzc1MzE1NTY5LCJleHAiOjE4MDQ0MzIzNjl9.z_0JTXmwGT-XllV0VroPolAKnfns2zNhi8kRJ9Yi2g8' \
--data-raw '{
  "name": "Rian Name",
  "email": "test@example.com",
  "district": "Dhaka",
  "preferredLanguage": "bn",
  "location": {
    "lat": 23.8103,
    "lng": 90.4125
  }
}'"


"curl --location --request PATCH 'http://localhost:8040/api/v1/auth/me/avatar' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMmE0MWUzOTQ0YWU2YjVmMjk4YTUiLCJwaG9uZSI6IjAxODcxMjY5MzUwIiwicm9sZSI6ImZhcm1lciIsInN0YXR1cyI6InBlbmRpbmdfa3ljIiwianRpIjoiNzNmY2YwMjAtODJlMC00OTkzLTk5OGQtN2Y2MDliN2JiYmY5IiwiaWF0IjoxNzc1MzE1NTY5LCJleHAiOjE4MDQ0MzIzNjl9.z_0JTXmwGT-XllV0VroPolAKnfns2zNhi8kRJ9Yi2g8' \
--form 'avatar=@"/path/to/file"' \
--form 'avatar=@"/rian-03/RIAN'\''s         photos/PIC (unsplash.com)/jon-tyson-L-p-7dDTM3I-unsplash.jpg"'"


"curl --location --request PATCH 'http://localhost:8040/api/v1/auth/fcm-token' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMmE0MWUzOTQ0YWU2YjVmMjk4YTUiLCJwaG9uZSI6IjAxODcxMjY5MzUwIiwicm9sZSI6ImZhcm1lciIsInN0YXR1cyI6InBlbmRpbmdfa3ljIiwianRpIjoiNzNmY2YwMjAtODJlMC00OTkzLTk5OGQtN2Y2MDliN2JiYmY5IiwiaWF0IjoxNzc1MzE1NTY5LCJleHAiOjE4MDQ0MzIzNjl9.z_0JTXmwGT-XllV0VroPolAKnfns2zNhi8kRJ9Yi2g8' \
--data '{
  "fcmToken": "new-fcm-token-from-firebase"
}'"
