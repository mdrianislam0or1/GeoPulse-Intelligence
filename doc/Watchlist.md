curl --location 'https://geopulse-inteligence-server.vercel.app/api/auth/watchlist' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo' \
--data '{
    "type": "country",
    "value": "BD",
    "notify_socket": true,
    "notify_email": true
}'


{"success":true,"statusCode":201,"message":"Watchlist item created","data":{"user_id":"69997df064497b2c13c55dfd","type":"country","value":"BD","notify_socket":true,"notify_email":true,"is_active":true,"_id":"6999a8714a9a34c551568ec5","createdAt":"2026-02-21T12:43:29.843Z","updatedAt":"2026-02-21T12:43:29.843Z","__v":0}}



curl --location 'https://geopulse-inteligence-server.vercel.app/api/auth/watchlist' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'

{"success":true,"statusCode":200,"message":"Watchlist items retrieved","data":[{"_id":"69998036ace30728f24c3bdd","user_id":"69997df064497b2c13c55dfd","type":"country","value":"BD","notify_socket":true,"notify_email":true,"is_active":true,"createdAt":"2026-02-21T09:51:50.089Z","updatedAt":"2026-02-21T09:51:50.089Z","__v":0}]}


curl --location --request DELETE 'https://geopulse-inteligence-server.vercel.app/api/auth/watchlist/6999a8714a9a34c551568ec5' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


{"success":true,"statusCode":200,"message":"Watchlist item deleted","data":null}



curl --location 'https://geopulse-inteligence-server.vercel.app/api/auth/alerts?page=1&limit=20' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'



{"success":true,"statusCode":200,"message":"Alerts retrieved","meta":{"page":1,"limit":20,"total":0,"totalPages":0},"data":[]}


curl --location --request PATCH 'https://geopulse-inteligence-server.vercel.app/api/auth/alerts//read' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'
