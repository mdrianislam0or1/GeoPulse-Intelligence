curl --location 'https://geopulse-inteligence-server.vercel.app/api/analysis?page=1&limit=20' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'



response

{
    "success": true,
    "statusCode": 200,
    "message": "Analyses retrieved",
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 30,
        "totalPages": 2,
        "hasNextPage": true,
        "hasPrevPage": false
    },
    "data": [
        {
            "_id": "6999a5f4d20674014cac82bd",
            "article_id": {
                "_id": "69999c4ee530d2c55e9ea8b6",
                "source_api": "newsapi",
                "title": "Top 25 Stories From ComicsPRO Day One: Daily LITG, 20th February 2026",
                "url": "https://bleedingcool.com/comics/top-25-stories-from-comicspro-day-one-daily-litg-20th-february-2026/",
                "country": "BD"
            },
            "classification": {
                "category": "entertainment",
                "sub_categories": [
                    "comics"
                ],
                "confidence": 0.9
            },
            "sentiment": {
                "label": "neutral",
                "polarity": 0
            },
            "bias_score": 0.1,
            "fake_news_probability": 0.05,
            "topics": [
                {
                    "name": "comics",
                    "score": 0.9
                },
                {
                    "name": "Star Trek",
                    "score": 0.3
                }
            ],
            "summary_ai": "This article summarizes the top 25 stories from ComicsPRO Day One, including news about a new Star Trek series. It is a daily roundup of the most-read stories in the comics industry.",
            "entities": {
                "countries": [],
                "people": [
                    "Seven Of Nine"
                ],
                "organizations": [
                    "ComicsPRO",
                    "Bleeding Cool"
                ]
            },
            "risk_score": 0,
            "analyzed_at": "2026-02-21T12:32:52.630Z",
            "ai_model": "mistralai/mistral-small-3.1-24b-instruct:free",
            "token_usage": {
                "prompt_tokens": 436,
                "completion_tokens": 254,
                "total_tokens": 690
            },
            "createdAt": "2026-02-21T12:32:52.631Z",
            "updatedAt": "2026-02-21T12:32:52.631Z",
            "__v": 0
        },
        {
            "_id": "6999a5e3d20674014cac82b8",
            "article_id": {
                "_id": "69999c4fe530d2c55e9ea8bb",
                "source_api": "newsapi",
                "title": "UPSC Quiz – 2026 : IASbaba’s Daily Current Affairs Quiz 20th February 2026",
                "url": "https://iasbaba.com/2026/02/upsc-quiz-2026-iasbabas-daily-current-affairs-quiz-20th-february-2026/",
                "country": "BD"
            },
            "classification": {
                "category": "other",
                "sub_categories": [
                    "education",
                    "exam preparation"
                ],
                "confidence": 0.95
            },
            "sentiment": {
                "label": "neutral",
                "polarity": 0
            },
            "bias_score": 0.1,
            "fake_news_probability": 0.05,
            "topics": [
                {
                    "name": "current affairs",
                    "score": 0.8
                },
                {
                    "name": "UPSC",
                    "score": 0.7
                },
                {
                    "name": "exam preparation",
                    "score": 0.6
                }
            ],
            "summary_ai": "This article announces a daily current affairs quiz for UPSC exam preparation, drawing content from major news sources like The Hindu and Indian Express.",
            "entities": {
                "countries": [],
                "people": [],
                "organizations": [
                    "UPSC",
                    "IASbaba",
                    "The Hindu",
                    "Indian Express",
                    "PIB"
                ]
            },
            "risk_score": 0,
            "analyzed_at": "2026-02-21T12:32:35.342Z",
            "ai_model": "mistralai/mistral-small-3.1-24b-instruct:free",
            "token_usage": {
                "prompt_tokens": 410,
                "completion_tokens": 285,
                "total_tokens": 695
            },
            "createdAt": "2026-02-21T12:32:35.344Z",
            "updatedAt": "2026-02-21T12:32:35.344Z",
            "__v": 0
        },
        {
            "_id": "6999a5d1d20674014cac82b3",
            "article_id": {
                "_id": "69999c4fe530d2c55e9ea8c1",
                "source_api": "newsapi",
                "title": "Mamdani shortchanges MTA — by $621M — in preliminary budget while pushing free buses",
                "url": "https://nypost.com/2026/02/20/us-news/mamdani-shortchanges-mta-in-preliminary-budget-while-pushing-free-buses/",
                "country": "BD"
            },
            "classification": {
                "category": "politics",
                "sub_categories": [
                    "budget",
                    "transportation"
                ],
                "confidence": 0.95
            },
            "sentiment": {
                "label": "negative",
                "polarity": -0.4
            },
            "bias_score": 0.6,
            "fake_news_probability": 0.1,
            "topics": [
                {
                    "name": "budget",
                    "score": 0.8
                },
                {
                    "name": "transportation",
                    "score": 0.7
                },
                {
                    "name": "politics",
                    "score": 0.6
                }
            ],
            "summary_ai": "The New York City Comptroller's office claims the Mamdani administration's preliminary budget significantly underestimates the city's financial obligations to the MTA, by $621 million, while simultaneously promoting free bus services.",
            "entities": {
                "countries": [],
                "people": [
                    "Mamdani"
                ],
                "organizations": [
                    "MTA",
                    "New York City Comptroller's office"
                ]
            },
            "risk_score": 10,
            "analyzed_at": "2026-02-21T12:32:17.687Z",
            "ai_model": "mistralai/mistral-small-3.1-24b-instruct:free",
            "token_usage": {
                "prompt_tokens": 387,
                "completion_tokens": 297,
                "total_tokens": 684
            },
            "createdAt": "2026-02-21T12:32:17.689Z",
            "updatedAt": "2026-02-21T12:32:17.689Z",
            "__v": 0
        },
        {
            "_id": "6999a5c2d20674014cac82ae",
            "article_id": {
                "_id": "69999c4fe530d2c55e9ea8c6",
                "source_api": "newsapi",
                "title": "“Avengers: Armageddon” Replaces ‘Doomsday’ as Next Major Marvel Event",
                "url": "https://insidethemagic.net/2026/02/avengers-armageddon-replaces-doomsday-as-next-major-marvel-avengers-event-th1/",
                "country": "BD"
            },
            "classification": {
                "category": "entertainment",
                "sub_categories": [
                    "movies",
                    "comics"
                ],
                "confidence": 0.95
            },
            "sentiment": {
                "label": "neutral",
                "polarity": 0
            },
            "bias_score": 0.1,
            "fake_news_probability": 0.05,
            "topics": [
                {
                    "name": "Marvel Cinematic Universe",
                    "score": 0.9
                },
                {
                    "name": "Avengers",
                    "score": 0.85
                },
                {
                    "name": "Movies",
                    "score": 0.75
                }
            ],
            "summary_ai": "Marvel Studios is planning a new Avengers movie, set to be released in December 2026, as the fifth installment in the Avengers series.",
            "entities": {
                "countries": [],
                "people": [],
                "organizations": [
                    "Marvel Studios",
                    "Marvel Cinematic Universe"
                ]
            },
            "risk_score": 0,
            "analyzed_at": "2026-02-21T12:32:02.002Z",
            "ai_model": "mistralai/mistral-small-3.1-24b-instruct:free",
            "token_usage": {
                "prompt_tokens": 394,
                "completion_tokens": 263,
                "total_tokens": 657
            },
            "createdAt": "2026-02-21T12:32:02.004Z",
            "updatedAt": "2026-02-21T12:32:02.004Z",
            "__v": 0
        },
        {
            "_id": "6999a5b0d20674014cac82a9",
            "article_id": {
                "_id": "69999c50e530d2c55e9ea8cb",
                "source_api": "newsapi",
                "title": "The dirty work, Kouretas and Papastergiou, Domna and the Ark (of sin), slacking and nutrition, the data centers, the Greeks and the LNG",
                "url": "https://en.protothema.gr/2026/02/20/the-dirty-work-kouretas-and-papastergiou-domna-and-the-ark-of-sin-slacking-and-nutrition-the-data-centers-the-greeks-and-the-lng/",
                "country": "BD"
            },
            "classification": {
                "category": "other",
                "sub_categories": [
                    "legal",
                    "politics",
                    "economy"
                ],
                "confidence": 0.7
            },
            "sentiment": {
                "label": "mixed",
                "polarity": 0.1
            },
            "bias_score": 0.6,
            "fake_news_probability": 0.1,
            "topics": [
                {
                    "name": "legal proceedings",
                    "score": 0.8
                },
                {
                    "name": "government policy",
                    "score": 0.5
                },
                {
                    "name": "energy",
                    "score": 0.3
                }
            ],
            "summary_ai": "The article discusses the Violanta case, mentioning depositions and individuals involved, while also touching upon various topics like digital policy, Italian olive oil plans, and Greek bureaucracy.",
            "entities": {
                "countries": [
                    "Greece",
                    "Italy"
                ],
                "people": [
                    "Kouretas",
                    "Papastergiou",
                    "Domna"
                ],
                "organizations": []
            },
            "risk_score": 30,
            "analyzed_at": "2026-02-21T12:31:44.436Z",
            "ai_model": "mistralai/mistral-small-3.1-24b-instruct:free",
            "token_usage": {
                "prompt_tokens": 414,
                "completion_tokens": 298,
                "total_tokens": 712
            },
            "createdAt": "2026-02-21T12:31:44.438Z",
            "updatedAt": "2026-02-21T12:31:44.438Z",
            "__v": 0
        },
        {
            "_id": "6999a59fd20674014cac82a4",
            "article_id": {
                "_id": "69999e54d20674014cac824f",
                "source_api": "rss2json",
                "title": "Cleaning 100 mosques for millions of worshippers through ‘purity in cleanliness’ campaign",
                "url": "https://en.prothomalo.com/corporate/g80sb26wm0",
                "country": "BD"
            },
            "classification": {
                "category": "society",
                "sub_categories": [
                    "religion",
                    "social issues",
                    "corporate social responsibility"
                ],
                "confidence": 0.9
            },
            "sentiment": {
                "label": "positive",
                "polarity": 0.4
            },
            "bias_score": 0.1,
            "fake_news_probability": 0.05,
            "topics": [
                {
                    "name": "cleanliness",
                    "score": 0.8
                },
                {
                    "name": "religion",
                    "score": 0.7
                },
                {
                    "name": "corporate social responsibility",
                    "score": 0.6
                }
            ],
            "summary_ai": "Lizol launched a mosque cleaning campaign called 'Purity in Cleanliness' for the third consecutive year during Ramadan, cleaning over 100 mosques to create a conducive environment for worship and reinforce its commitment to public welfare.",
            "entities": {
                "countries": [
                    "Bangladesh"
                ],
                "people": [],
                "organizations": [
                    "Lizol"
                ]
            },
            "risk_score": 0,
            "analyzed_at": "2026-02-21T12:31:27.137Z",
            "ai_model": "mistralai/mistral-small-3.1-24b-instruct:free",
            "token_usage": {
                "prompt_tokens": 580,
                "completion_tokens": 293,
                "total_tokens": 873
            },
            "createdAt": "2026-02-21T12:31:27.139Z",
            "updatedAt": "2026-02-21T12:31:27.139Z",
            "__v": 0
        },




curl --location 'https://geopulse-inteligence-server.vercel.app/api/analysis/article/69999e55d20674014cac825b' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo'


response

{"success":true,"statusCode":200,"message":"Analysis retrieved","data":{"_id":"6999a558d20674014cac8290","article_id":"69999e55d20674014cac825b","classification":{"category":"economy","sub_categories":["economic policy","financial crisis"],"confidence":0.9},"sentiment":{"label":"neutral","polarity":0},"bias_score":0.2,"fake_news_probability":0.05,"topics":[{"name":"economy","score":0.9},{"name":"finance","score":0.8},{"name":"economic policy","score":0.7}],"summary_ai":"The article discusses the importance of learning from past economic mistakes to improve future economic performance, using the example of Ben Bernanke's work. It introduces Amir Khasru Mahmud Chowdhury, the new Finance Minister of Bangladesh, and suggests he should analyze current economic challenges.","entities":{"countries":["Bangladesh"],"people":["Ben Bernanke","Amir Khasru Mahmud Chowdhury"],"organizations":["Bangladesh Bank","Bangladesh Nationalist Party (BNP)"]},"risk_score":10,"analyzed_at":"2026-02-21T12:30:16.766Z","ai_model":"mistralai/mistral-small-3.1-24b-instruct:free","token_usage":{"prompt_tokens":636,"completion_tokens":325,"total_tokens":961},"createdAt":"2026-02-21T12:30:16.768Z","updatedAt":"2026-02-21T12:30:16.768Z","__v":0}}




curl --location 'https://geopulse-inteligence-server.vercel.app/api/analysis/trigger' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo' \
--data '{
    "articleId": "69999e55d20674014cac825b"
}'



response

{"success":true,"statusCode":200,"message":"Article analyzed","data":{"classification":{"category":"economy","sub_categories":["economic policy","financial crisis"],"confidence":0.9},"sentiment":{"label":"neutral","polarity":0},"entities":{"countries":["Bangladesh"],"people":["Ben Bernanke","Amir Khasru Mahmud Chowdhury"],"organizations":["Bangladesh Bank","Bangladesh Nationalist Party (BNP)"]},"token_usage":{"prompt_tokens":636,"completion_tokens":325,"total_tokens":961},"_id":"6999a558d20674014cac8290","article_id":"69999e55d20674014cac825b","bias_score":0.2,"fake_news_probability":0.05,"topics":[{"name":"economy","score":0.9},{"name":"finance","score":0.8},{"name":"economic policy","score":0.7}],"summary_ai":"The article discusses the importance of learning from past economic mistakes to improve future economic performance, using the example of Ben Bernanke's work. It introduces Amir Khasru Mahmud Chowdhury, the new Finance Minister of Bangladesh, and suggests he should analyze current economic challenges.","risk_score":10,"analyzed_at":"2026-02-21T12:30:16.766Z","ai_model":"mistralai/mistral-small-3.1-24b-instruct:free","createdAt":"2026-02-21T12:30:16.768Z","updatedAt":"2026-02-21T12:30:16.768Z","__v":0,"id":"6999a558d20674014cac8290"}}




curl --location 'https://geopulse-inteligence-server.vercel.app/api/analysis/trigger' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk5N2RmMDY0NDk3YjJjMTNjNTVkZmQiLCJlbWFpbCI6InJpYW5pc2xhbS5kZ0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3MTY2Njk1MiwiZXhwIjoxNzcxNzUzMzUyfQ.4_VFOQR_76UfGNZdie7YrBriavi19eBb_M695XnVZRo' \
--data '{
    "batchSize": 5
}'


response
{"success":true,"statusCode":200,"message":"Batch analysis complete: 5 articles analyzed","data":{"analyzed":5}}
