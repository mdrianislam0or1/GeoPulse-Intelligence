curl --location 'https://geopulse-inteligence-server.vercel.app/api/admin/users?page=1&limit=20' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


{"success":true,"statusCode":200,"message":"Users retrieved","meta":{"page":1,"limit":20,"total":1,"totalPages":1},"data":[{"_id":"69997df064497b2c13c55dfd","fullName":"Rian Islam","username":"rianislam","email":"rianislam.dg@gmail.com","avatar":null,"bio":null,"location":null,"website":null,"socialLinks":{"github":null,"linkedin":null,"twitter":null,"portfolio":null},"role":"admin","preferences":{"theme":"dark","language":"en","timezone":"UTC","emailNotifications":true,"seoOptimization":true},"isActive":true,"isEmailVerified":false,"isTwoFactorEnabled":false,"lastLogin":"2026-02-21T12:41:51.802Z","createdAt":"2026-02-21T09:42:08.010Z","updatedAt":"2026-02-21T12:42:07.600Z","__v":0}]}




curl --location 'https://geopulse-inteligence-server.vercel.app/api/admin/api-usage' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'



{"success":true,"statusCode":200,"message":"API usage overview","data":[{"_id":"69997cf94daca35cb67c110f","api_name":"newsapi","__v":0,"createdAt":"2026-02-21T09:38:00.885Z","daily_limit":500,"last_reset":"2026-02-21T09:38:00.881Z","last_used_at":"2026-02-21T12:47:26.636Z","updatedAt":"2026-02-21T17:34:44.677Z","used_today":4},{"_id":"69997cf94daca35cb67c1110","api_name":"currentsapi","__v":0,"createdAt":"2026-02-21T09:38:01.352Z","daily_limit":20,"last_reset":"2026-02-21T09:38:01.352Z","last_used_at":"2026-02-21T12:46:44.332Z","updatedAt":"2026-02-21T17:35:16.229Z","used_today":5},{"_id":"69997cf94daca35cb67c1111","api_name":"gnews","__v":0,"createdAt":"2026-02-21T09:38:01.853Z","daily_limit":100,"last_reset":"2026-02-21T09:38:01.852Z","last_used_at":"2026-02-21T12:46:44.822Z","updatedAt":"2026-02-21T17:13:28.568Z","used_today":3},{"_id":"69997cf94daca35cb67c1112","api_name":"rss2json","__v":0,"createdAt":"2026-02-21T09:38:01.902Z","daily_limit":9999,"last_reset":"2026-02-21T09:38:01.902Z","last_used_at":"2026-02-21T12:46:48.818Z","updatedAt":"2026-02-21T17:13:28.772Z","used_today":10}]}
