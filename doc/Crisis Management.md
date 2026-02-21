

curl --location --request POST 'https://geopulse-inteligence-server.vercel.app/api/crisis/detect' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'



{"success":true,"statusCode":200,"message":"0 crisis event(s) detected","data":[]}




curl --location 'https://geopulse-inteligence-server.vercel.app/api/crisis/stats' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'



{"success":true,"statusCode":200,"message":"Crisis statistics retrieved","data":{"total":2,"active":2,"critical":0}}
