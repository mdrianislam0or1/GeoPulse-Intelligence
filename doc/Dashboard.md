curl --location 'https://geopulse-inteligence-server.vercel.app/api/dashboard/overview' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'



{"success":true,"statusCode":200,"message":"Dashboard overview","data":{"summary":{"totalArticles":105,"totalAnalyzed":65,"pendingAnalysis":40,"activeCrises":2},"categoryDistribution":[{"_id":"politics","count":9,"avgConfidence":0.9333333333333333},{"_id":"entertainment","count":8,"avgConfidence":0.89375},{"_id":"economy","count":8,"avgConfidence":0.925},{"_id":"society","count":5,"avgConfidence":0.9},{"_id":"technology","count":4,"avgConfidence":0.8875},{"_id":"sports","count":4,"avgConfidence":0.925},{"_id":"health","count":2,"avgConfidence":0.925},{"_id":"crisis","count":2,"avgConfidence":0.95},{"_id":"other","count":2,"avgConfidence":0.825},{"_id":"environment","count":1,"avgConfidence":0.95}],"sentimentDistribution":[{"_id":"neutral","count":18,"avgPolarity":0.022222222222222223},{"_id":"negative","count":15,"avgPolarity":-0.43333333333333335},{"_id":"positive","count":8,"avgPolarity":0.525},{"_id":"mixed","count":4,"avgPolarity":0.05}],"dailyVolume":[{"_id":"2026-02-21","count":105}],"crisisIndex":[{"_id":"high","count":2,"avgRisk":70}]}}





curl --location 'https://geopulse-inteligence-server.vercel.app/api/dashboard/categories' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'



{"success":true,"statusCode":200,"message":"Category distribution","data":[{"_id":"politics","count":9,"avgConfidence":0.9333333333333333},{"_id":"economy","count":8,"avgConfidence":0.925},{"_id":"entertainment","count":8,"avgConfidence":0.89375},{"_id":"society","count":5,"avgConfidence":0.9},{"_id":"technology","count":4,"avgConfidence":0.8875},{"_id":"sports","count":4,"avgConfidence":0.925},{"_id":"crisis","count":2,"avgConfidence":0.95},{"_id":"health","count":2,"avgConfidence":0.925},{"_id":"other","count":2,"avgConfidence":0.825},{"_id":"environment","count":1,"avgConfidence":0.95}]}



curl --location 'https://geopulse-inteligence-server.vercel.app/api/dashboard/sentiment' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'




{"success":true,"statusCode":200,"message":"Sentiment distribution","data":[{"_id":"neutral","count":18,"avgPolarity":0.022222222222222223},{"_id":"negative","count":15,"avgPolarity":-0.43333333333333335},{"_id":"positive","count":8,"avgPolarity":0.525},{"_id":"mixed","count":4,"avgPolarity":0.05}]}



curl --location 'https://geopulse-inteligence-server.vercel.app/api/dashboard/volume?days=30' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


{"success":true,"statusCode":200,"message":"Daily volume","data":[{"_id":"2026-02-21","count":105}]}




curl --location 'https://geopulse-inteligence-server.vercel.app/api/dashboard/countries' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


{"success":true,"statusCode":200,"message":"Country distribution","data":[{"_id":"BD","count":105}]}




curl --location 'https://geopulse-inteligence-server.vercel.app/api/dashboard/sources' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'



{"success":true,"statusCode":200,"message":"Source distribution","data":[{"_id":"newsapi","count":71},{"_id":"rss2json","count":24},{"_id":"gnews","count":10}]}




curl --location 'https://geopulse-inteligence-server.vercel.app/api/dashboard/crisis-index' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'



{"success":true,"statusCode":200,"message":"Crisis index","data":[{"_id":"high","count":2,"avgRisk":70}]}





curl --location 'https://geopulse-inteligence-server.vercel.app/api/dashboard/fake-news?days=30' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'



{"success":true,"statusCode":200,"message":"Fake news trend","data":[{"_id":"2026-02-21","avgProbability":0.0668888888888889,"count":45}]}




curl --location 'https://geopulse-inteligence-server.vercel.app/api/dashboard/bias?days=30' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


{"success":true,"statusCode":200,"message":"Bias trends","data":[{"_id":"2026-02-21","avgBias":0.2611111111111111,"count":45}]}





curl --location 'https://geopulse-inteligence-server.vercel.app/api/dashboard/topics' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'




{"success":true,"statusCode":200,"message":"Topic heatmap","data":[{"_id":"politics","totalScore":1.3,"count":3},{"_id":"artificial intelligence","totalScore":2,"count":3},{"_id":"religion","totalScore":1.2999999999999998,"count":2},{"_id":"finance","totalScore":1.5,"count":2},{"_id":"sports","totalScore":1.6,"count":2},{"_id":"music","totalScore":1.2999999999999998,"count":2},{"_id":"Volodymyr Zelensky","totalScore":0.9,"count":1},{"_id":"dividends","totalScore":0.8,"count":1},{"_id":"rugby","totalScore":0.9,"count":1},{"_id":"human rights","totalScore":0.6,"count":1},{"_id":"sponsorship","totalScore":0.6,"count":1},{"_id":"Authoritarianism","totalScore":0.6,"count":1},{"_id":"Academy Awards","totalScore":0.8,"count":1},{"_id":"investments","totalScore":0.8,"count":1},{"_id":"Marvel Cinematic Universe","totalScore":0.9,"count":1},{"_id":"legal proceedings","totalScore":0.8,"count":1},{"_id":"Iran-US relations","totalScore":0.9,"count":1},{"_id":"Monarchy","totalScore":0.9,"count":1},{"_id":"Cuba","totalScore":0.9,"count":1},{"_id":"Pokemon","totalScore":0.75,"count":1},{"_id":"Immigration Detention","totalScore":0.9,"count":1},{"_id":"Jeffrey Epstein","totalScore":0.8,"count":1},{"_id":"UPSC","totalScore":0.7,"count":1},{"_id":"Canada","totalScore":0.4,"count":1},{"_id":"community health","totalScore":0.8,"count":1},{"_id":"Humanitarian crisis","totalScore":0.7,"count":1},{"_id":"climate change","totalScore":0.8,"count":1},{"_id":"economic decline","totalScore":0.8,"count":1},{"_id":"film festival","totalScore":0.8,"count":1},{"_id":"politics in art","totalScore":0.7,"count":1}]}
