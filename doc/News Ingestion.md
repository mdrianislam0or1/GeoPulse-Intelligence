curl --location 'https://geopulse-inteligence-server.vercel.app/api/news?page=1&limit=20' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'

response

{
    "success": true,
    "statusCode": 200,
    "message": "Articles retrieved",
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 69,
        "totalPages": 4,
        "hasNextPage": true,
        "hasPrevPage": false
    },
    "data": [
        {
            "_id": "69999e55d20674014cac825b",
            "source_api": "rss2json",
            "title": "Five tasks for the new finance minister",
            "description": "They say there's no use to cry over spilt milk. It may be prudent not to waste time dwelling over past mistakes, but that does not apply to the economy. Here, one must investigate why the milk was spilt , so that this doesn't happen again in the future.\nThe core research of Nobel laureate economist Ben Bernanke focused on the Great Depression of the 1930s, an event long past. He used that knowledge to navigate the global financial crisis of 2008. 'Time' magazine named him “Person of the Year” in",
            "content": "They say there's no use to cry over spilt milk. It may be prudent not to waste time dwelling over past mistakes, but that does not apply to the economy. Here, one must investigate why the milk was spilt , so that this doesn't happen again in the future.\nThe core research of Nobel laureate economist Ben Bernanke focused on the Great Depression of the 1930s, an event long past. He used that knowledge to navigate the global financial crisis of 2008. 'Time' magazine named him “Person of the Year” in 2009. Similarly, to understand what needs to be done for the economy going forward, we must first examine why an emerging tiger has suddenly been assailed by all sorts of ailments. \nAmir Khasru Mahmud Chowdhury has been sworn in as the Minister of Finance and Planning in the cabinet of the Bangladesh Nationalist Party (BNP) government. He understands not only business and trade, but also macroeconomics quite well. During my tenure at Bangladesh Bank from 2015 to 2016, I had the opportunity to h",
            "url": "https://en.prothomalo.com/opinion/op-ed/c4rthep597",
            "image_url": "https://media.prothomalo.com/prothomalo-english/2026-02-21/2a66fedg/finance.avif",
            "published_at": "2026-02-21T04:42:37.000Z",
            "source_name": "Prothom Alo English",
            "author": "Birupaksha Paul",
            "country": "BD",
            "language": "en",
            "content_hash": "ba9a21960075498a02fb238322346f27",
            "is_analyzed": true,
            "entities": {
                "countries": [
                    "Bangladesh"
                ],
                "people": [
                    "Ben Bernanke",
                    "Amir Khasru Mahmud Chowdhury"
                ],
                "organizations": [
                    "Bangladesh Bank",
                    "Bangladesh Nationalist Party (BNP)"
                ]
            },
            "fetch_batch_id": null,
            "createdAt": "2026-02-21T12:00:21.059Z",
            "updatedAt": "2026-02-21T12:30:16.852Z",
            "__v": 0
        },
        {
            "_id": "69999e54d20674014cac8258",
            "source_api": "rss2json",
            "title": "Political drama overshadows Berlin Film Festival finale",
            "description": "The 76th Berlin Film Festival draws to a close on Saturday after 10 days in which the 22 films in competition were often overshadowed by a row over the role politics should play in filmmaking.\nThe controversy erupted at the beginning of the festival when jury president Wim Wenders answered a question about the German government's support for Israel by saying: \"We cannot really enter the field of politics.\"\nAt the same press conference he had earlier said that films had the power to \"change the w",
            "content": "The 76th Berlin Film Festival draws to a close on Saturday after 10 days in which the 22 films in competition were often overshadowed by a row over the role politics should play in filmmaking.\nThe controversy erupted at the beginning of the festival when jury president Wim Wenders answered a question about the German government's support for Israel by saying: \"We cannot really enter the field of politics.\"\nAt the same press conference he had earlier said that films had the power to \"change the world\" but in a different way from party politics.\n\"No movie has ever changed the ideas of a politician, but we can change the idea that people have of how they should live,\" Wenders, 80, said.\nBut his comments in response to the question on Israel prompted a storm of outrage.\nAward-winning Indian novelist Arundhati Roy, who had been due to present a restored version of a 1989 film she wrote, pulled out of the event, branding Wender's words \"unconscionable\" and \"jaw-dropping\".\nOn Tuesday, a lette",
            "url": "https://en.prothomalo.com/entertainment/movies/14rmgp8djw",
            "image_url": "https://media.prothomalo.com/prothomalo-english/2026-02-21/scxose3v/OHQAKU77RRLC3I4H2V3CZ6GDE4.avif",
            "published_at": "2026-02-21T05:09:56.000Z",
            "source_name": "Prothom Alo English",
            "author": "AFP",
            "country": "BD",
            "language": "en",
            "content_hash": "fc437e867ee3a34eec6120cb3342ec35",
            "is_analyzed": true,
            "entities": {
                "countries": [
                    "Germany",
                    "Israel",
                    "India"
                ],
                "people": [
                    "Wim Wenders",
                    "Arundhati Roy"
                ],
                "organizations": []
            },
            "fetch_batch_id": null,
            "createdAt": "2026-02-21T12:00:20.975Z",
            "updatedAt": "2026-02-21T12:30:35.044Z",
            "__v": 0
        },



curl --location 'https://geopulse-inteligence-server.vercel.app/api/news/69999e55d20674014cac825b' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


response
{"success":true,"statusCode":200,"message":"Article retrieved","data":{"_id":"69999e55d20674014cac825b","source_api":"rss2json","title":"Five tasks for the new finance minister","description":"They say there's no use to cry over spilt milk. It may be prudent not to waste time dwelling over past mistakes, but that does not apply to the economy. Here, one must investigate why the milk was spilt , so that this doesn't happen again in the future.\nThe core research of Nobel laureate economist Ben Bernanke focused on the Great Depression of the 1930s, an event long past. He used that knowledge to navigate the global financial crisis of 2008. 'Time' magazine named him “Person of the Year” in","content":"They say there's no use to cry over spilt milk. It may be prudent not to waste time dwelling over past mistakes, but that does not apply to the economy. Here, one must investigate why the milk was spilt , so that this doesn't happen again in the future.\nThe core research of Nobel laureate economist Ben Bernanke focused on the Great Depression of the 1930s, an event long past. He used that knowledge to navigate the global financial crisis of 2008. 'Time' magazine named him “Person of the Year” in 2009. Similarly, to understand what needs to be done for the economy going forward, we must first examine why an emerging tiger has suddenly been assailed by all sorts of ailments. \nAmir Khasru Mahmud Chowdhury has been sworn in as the Minister of Finance and Planning in the cabinet of the Bangladesh Nationalist Party (BNP) government. He understands not only business and trade, but also macroeconomics quite well. During my tenure at Bangladesh Bank from 2015 to 2016, I had the opportunity to h","url":"https://en.prothomalo.com/opinion/op-ed/c4rthep597","image_url":"https://media.prothomalo.com/prothomalo-english/2026-02-21/2a66fedg/finance.avif","published_at":"2026-02-21T04:42:37.000Z","source_name":"Prothom Alo English","author":"Birupaksha Paul","country":"BD","language":"en","content_hash":"ba9a21960075498a02fb238322346f27","is_analyzed":true,"entities":{"countries":["Bangladesh"],"people":["Ben Bernanke","Amir Khasru Mahmud Chowdhury"],"organizations":["Bangladesh Bank","Bangladesh Nationalist Party (BNP)"]},"fetch_batch_id":null,"createdAt":"2026-02-21T12:00:21.059Z","updatedAt":"2026-02-21T12:30:16.852Z","__v":0}}




curl --location 'https://geopulse-inteligence-server.vercel.app/api/news/ingest' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo' \
--data '{
    "source": "all"
}'


response
{"success":true,"statusCode":200,"message":"Ingestion triggered for all sources","data":[{"source":"newsapi","fetched":20,"saved":20,"duplicates":0,"errors":0,"timestamp":"2026-02-21T12:46:39.828Z"},{"source":"currentsapi","fetched":0,"saved":0,"duplicates":0,"errors":0,"timestamp":"2026-02-21T12:46:44.522Z"},{"source":"gnews","fetched":10,"saved":0,"duplicates":10,"errors":0,"timestamp":"2026-02-21T12:46:46.904Z"},{"source":"rss2json","fetched":20,"saved":0,"duplicates":20,"errors":0,"timestamp":"2026-02-21T12:46:52.739Z"}]}




curl --location 'https://geopulse-inteligence-server.vercel.app/api/news/ingest' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo' \
--data '{
    "source": "newsapi"
}'


{"success":true,"statusCode":200,"message":"Ingestion triggered for newsapi","data":{"source":"newsapi","fetched":16,"saved":16,"duplicates":0,"errors":0,"timestamp":"2026-02-21T12:47:32.851Z"}}
