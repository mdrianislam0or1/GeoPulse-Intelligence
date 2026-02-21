curl --location 'https://geopulse-inteligence-server.vercel.app/api/geo/crises?page=1&limit=20' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


{"success":true,"statusCode":200,"message":"Crises retrieved","meta":{"page":1,"limit":20,"total":2,"totalPages":1,"hasNextPage":false,"hasPrevPage":false},"data":[{"_id":"6999aafb4a9a34c551568f99","title":"Road accident kills 5 in Kushtia","type":"natural_disaster","severity":"high","countries_affected":[],"status":"active","source_articles":["69999e54d20674014cac8252"],"risk_score":65,"description":"A head-on collision between a CNG auto-rickshaw and a truck in Kushtia resulted in the deaths of five people, including three women. Police are investigating the accident and have seized the vehicles involved.","started_at":"2026-02-21T12:54:19.099Z","resolved_at":null,"createdAt":"2026-02-21T12:54:19.101Z","updatedAt":"2026-02-21T12:54:19.101Z","__v":0},{"_id":"6999a2e433c96fbe643cb0ec","title":"Six deaths in six weeks: What to know about ICE detentions in Texas","type":"natural_disaster","severity":"high","countries_affected":["CUBA","TEXAS"],"status":"active","source_articles":["69999c52e530d2c55e9ea8e4"],"risk_score":75,"description":"The article reports on a series of deaths in ICE detention centers in Texas, highlighting the recent suicide of a Cuban detainee and the high number of deaths in the past year, raising concerns about the conditions and treatment of detainees.","started_at":"2026-02-21T12:19:48.779Z","resolved_at":null,"createdAt":"2026-02-21T12:19:48.783Z","updatedAt":"2026-02-21T12:19:48.783Z","__v":0}]}






curl --location 'https://geopulse-inteligence-server.vercel.app/api/geo/crises/6999a2e433c96fbe643cb0ec' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


{"success":true,"statusCode":200,"message":"Crisis retrieved","data":{"_id":"6999a2e433c96fbe643cb0ec","title":"Six deaths in six weeks: What to know about ICE detentions in Texas","type":"natural_disaster","severity":"high","countries_affected":["CUBA","TEXAS"],"status":"active","source_articles":[{"_id":"69999c52e530d2c55e9ea8e4","source_api":"newsapi","title":"Six deaths in six weeks: What to know about ICE detentions in Texas","url":"https://www.salon.com/2026/02/20/six-deaths-in-six-weeks-what-to-know-about-ice-detentions-in-texas/"}],"risk_score":75,"description":"The article reports on a series of deaths in ICE detention centers in Texas, highlighting the recent suicide of a Cuban detainee and the high number of deaths in the past year, raising concerns about the conditions and treatment of detainees.","started_at":"2026-02-21T12:19:48.779Z","resolved_at":null,"createdAt":"2026-02-21T12:19:48.783Z","updatedAt":"2026-02-21T12:19:48.783Z","__v":0}}





curl --location 'https://geopulse-inteligence-server.vercel.app/api/geo/countries?region=South%20Asia' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


{"success":true,"statusCode":200,"message":"Countries retrieved","data":[{"_id":"69997cf94daca35cb67c1113","code":"BD","__v":0,"createdAt":"2026-02-21T09:38:01.942Z","last_updated":"2026-02-21T09:38:01.941Z","name":"Bangladesh","region":"South Asia","stability_index":55,"updatedAt":"2026-02-21T17:13:39.540Z"},{"_id":"69997cf94daca35cb67c1114","code":"IN","__v":0,"createdAt":"2026-02-21T09:38:01.985Z","last_updated":"2026-02-21T09:38:01.984Z","name":"India","region":"South Asia","stability_index":60,"updatedAt":"2026-02-21T17:13:39.729Z"},{"_id":"69997cfa4daca35cb67c1117","code":"NP","__v":0,"createdAt":"2026-02-21T09:38:02.107Z","last_updated":"2026-02-21T09:38:02.107Z","name":"Nepal","region":"South Asia","stability_index":55,"updatedAt":"2026-02-21T12:41:12.755Z"},{"_id":"69997cfa4daca35cb67c1115","code":"PK","__v":0,"createdAt":"2026-02-21T09:38:02.025Z","last_updated":"2026-02-21T09:38:02.025Z","name":"Pakistan","region":"South Asia","stability_index":40,"updatedAt":"2026-02-21T12:40:26.697Z"},{"_id":"69997cfa4daca35cb67c1116","code":"LK","__v":0,"createdAt":"2026-02-21T09:38:02.064Z","last_updated":"2026-02-21T09:38:02.064Z","name":"Sri Lanka","region":"South Asia","stability_index":50,"updatedAt":"2026-02-21T12:41:12.565Z"}]}
