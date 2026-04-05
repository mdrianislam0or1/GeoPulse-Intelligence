curl --location 'http://localhost:8040/api/v1/admin/tenants' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw' \
--data-raw '{
  "slug": "acme-corp1",
  "name": "Acme Corporation1",
  "domain": "hr.acme1.com",
  "primaryColor": "#1a73e8",
  "industry": "Technology",
  "country": "BD",
  "timezone": "Asia/Dhaka",
  "currency": "BDT",
  "ownerEmail": "admin@acme.com",
  "ownerName": "Admin",
  "ownerPassword": "Admin@123456"
}'

{
    "success": true,
    "data": {
        "status": true,
        "message": "Tenant provisioned",
        "data": {
            "slug": "acme-corp1",
            "name": "Acme Corporation1",
            "domain": "hr.acme1.com",
            "logoUrl": "",
            "primaryColor": "#1a73e8",
            "industry": "Technology",
            "country": "BD",
            "timezone": "Asia/Dhaka",
            "currency": "BDT",
            "locale": "en",
            "plan": "free",
            "status": "trial",
            "limits": {
                "maxEmployees": 10,
                "maxAdmins": 1,
                "maxBranches": 1,
                "storageMb": 100,
                "apiCallsPerDay": 500,
                "customRoles": false,
                "advancedReports": false,
                "apiAccess": false,
                "ssoEnabled": false
            },
            "trialEndsAt": "2026-03-22T17:46:16.605Z",
            "planRenewsAt": null,
            "stripeCustomerId": "",
            "stripeSubscriptionId": "",
            "enabledFeatures": [
                "recruitment"
            ],
            "ownerUser": null,
            "employeeCount": 0,
            "isDemo": false,
            "apiKey": "",
            "apiKeyGeneratedAt": null,
            "_id": "69adb5e812c41a7092649860",
            "createdAt": "2026-03-08T17:46:16.615Z",
            "updatedAt": "2026-03-08T17:46:16.615Z",
            "id": "69adb5e812c41a7092649860"
        },
        "serverTime": "2026-03-08T17:46:16.850Z",
        "localTime": "2026-03-08T23:46:16.850Z"
    },
    "timestamp": "2026-03-08T17:46:16.850Z"
}




curl --location 'http://localhost:8040/api/v1/admin/tenants?page=1&limit=10' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw'

{
    "success": true,
    "data": {
        "status": true,
        "message": "Tenants fetched",
        "data": [
            {
                "_id": "69adb5e812c41a7092649860",
                "slug": "acme-corp1",
                "name": "Acme Corporation1",
                "domain": "hr.acme1.com",
                "logoUrl": "",
                "primaryColor": "#1a73e8",
                "industry": "Technology",
                "country": "BD",
                "timezone": "Asia/Dhaka",
                "currency": "BDT",
                "locale": "en",
                "plan": "free",
                "status": "trial",
                "limits": {
                    "maxEmployees": 10,
                    "maxAdmins": 1,
                    "maxBranches": 1,
                    "storageMb": 100,
                    "apiCallsPerDay": 500,
                    "customRoles": false,
                    "advancedReports": false,
                    "apiAccess": false,
                    "ssoEnabled": false
                },
                "trialEndsAt": "2026-03-22T17:46:16.605Z",
                "planRenewsAt": null,
                "stripeCustomerId": "",
                "stripeSubscriptionId": "",
                "enabledFeatures": [
                    "recruitment"
                ],
                "ownerUser": null,
                "employeeCount": 0,
                "isDemo": false,
                "apiKey": "",
                "apiKeyGeneratedAt": null,
                "createdAt": "2026-03-08T17:46:16.615Z",
                "updatedAt": "2026-03-08T17:46:16.615Z",
                "__v": 0
            },
            {
                "_id": "69a915cb3d24e47d47f8af2f",
                "slug": "acme-corp",
                "name": "Acme Corporation",
                "domain": "hr.acme.com",
                "logoUrl": "",
                "primaryColor": "#1a73e8",
                "industry": "Technology",
                "country": "BD",
                "timezone": "Asia/Dhaka",
                "currency": "BDT",
                "locale": "en",
                "plan": "free",
                "status": "trial",
                "limits": {
                    "maxEmployees": 10,
                    "maxAdmins": 1,
                    "maxBranches": 1,
                    "storageMb": 100,
                    "apiCallsPerDay": 500,
                    "customRoles": false,
                    "advancedReports": false,
                    "apiAccess": false,
                    "ssoEnabled": false
                },
                "trialEndsAt": "2026-03-19T05:34:03.949Z",
                "planRenewsAt": null,
                "stripeCustomerId": "",
                "stripeSubscriptionId": "",
                "enabledFeatures": [
                    "recruitment"
                ],
                "ownerUser": null,
                "employeeCount": 0,
                "isDemo": false,
                "apiKey": "",
                "apiKeyGeneratedAt": null,
                "createdAt": "2026-03-05T05:34:03.964Z",
                "updatedAt": "2026-03-05T05:34:03.964Z",
                "__v": 0
            }
        ],
        "total": 2,
        "page": 1,
        "limit": 10,
        "totalPages": 1,
        "serverTime": "2026-03-08T17:48:54.466Z",
        "localTime": "2026-03-08T23:48:54.466Z"
    },
    "timestamp": "2026-03-08T17:48:54.467Z"
}




curl --location 'http://localhost:8040/api/v1/admin/tenants/stats' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw'

{
    "success": true,
    "data": {
        "status": true,
        "message": "Platform stats fetched",
        "data": {
            "total": 2,
            "byPlan": [
                {
                    "_id": "free",
                    "count": 2,
                    "employees": 0
                }
            ],
            "byStatus": [
                {
                    "_id": "trial",
                    "count": 2
                }
            ],
            "trialExpiring": 0
        },
        "serverTime": "2026-03-08T17:49:09.885Z",
        "localTime": "2026-03-08T23:49:09.885Z"
    },
    "timestamp": "2026-03-08T17:49:09.885Z"
}




curl --location 'http://localhost:8040/api/v1/admin/tenants/69adb5e812c41a7092649860' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw'


{
    "success": true,
    "data": {
        "status": true,
        "message": "Tenant fetched",
        "data": {
            "_id": "69adb5e812c41a7092649860",
            "slug": "acme-corp1",
            "name": "Acme Corporation1",
            "domain": "hr.acme1.com",
            "logoUrl": "",
            "primaryColor": "#1a73e8",
            "industry": "Technology",
            "country": "BD",
            "timezone": "Asia/Dhaka",
            "currency": "BDT",
            "locale": "en",
            "plan": "free",
            "status": "trial",
            "limits": {
                "maxEmployees": 10,
                "maxAdmins": 1,
                "maxBranches": 1,
                "storageMb": 100,
                "apiCallsPerDay": 500,
                "customRoles": false,
                "advancedReports": false,
                "apiAccess": false,
                "ssoEnabled": false
            },
            "trialEndsAt": "2026-03-22T17:46:16.605Z",
            "planRenewsAt": null,
            "stripeCustomerId": "",
            "stripeSubscriptionId": "",
            "enabledFeatures": [
                "recruitment"
            ],
            "ownerUser": null,
            "employeeCount": 0,
            "isDemo": false,
            "apiKey": "",
            "apiKeyGeneratedAt": null,
            "createdAt": "2026-03-08T17:46:16.615Z",
            "updatedAt": "2026-03-08T17:46:16.615Z",
            "id": "69adb5e812c41a7092649860"
        },
        "serverTime": "2026-03-08T17:50:29.339Z",
        "localTime": "2026-03-08T23:50:29.339Z"
    },
    "timestamp": "2026-03-08T17:50:29.340Z"
}




curl --location --request PATCH 'http://localhost:8040/api/v1/admin/tenants/69adb5e812c41a7092649860' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw' \
--data '{
  "name": "Acme Corp Updated"
}'

{
    "success": true,
    "data": {
        "status": true,
        "message": "Tenant updated",
        "data": {
            "_id": "69adb5e812c41a7092649860",
            "slug": "acme-corp1",
            "name": "Acme Corp Updated",
            "domain": "hr.acme1.com",
            "logoUrl": "",
            "primaryColor": "#1a73e8",
            "industry": "Technology",
            "country": "BD",
            "timezone": "Asia/Dhaka",
            "currency": "BDT",
            "locale": "en",
            "plan": "free",
            "status": "trial",
            "limits": {
                "maxEmployees": 10,
                "maxAdmins": 1,
                "maxBranches": 1,
                "storageMb": 100,
                "apiCallsPerDay": 500,
                "customRoles": false,
                "advancedReports": false,
                "apiAccess": false,
                "ssoEnabled": false
            },
            "trialEndsAt": "2026-03-22T17:46:16.605Z",
            "planRenewsAt": null,
            "stripeCustomerId": "",
            "stripeSubscriptionId": "",
            "enabledFeatures": [
                "recruitment"
            ],
            "ownerUser": null,
            "employeeCount": 0,
            "isDemo": false,
            "apiKey": "",
            "apiKeyGeneratedAt": null,
            "createdAt": "2026-03-08T17:46:16.615Z",
            "updatedAt": "2026-03-08T17:50:49.495Z",
            "id": "69adb5e812c41a7092649860"
        },
        "serverTime": "2026-03-08T17:50:49.603Z",
        "localTime": "2026-03-08T23:50:49.603Z"
    },
    "timestamp": "2026-03-08T17:50:49.603Z"
}



curl --location 'http://localhost:8040/api/v1/admin/tenants/69adb5e812c41a7092649860/change-plan' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw' \
--data '{
  "plan": "professional"
}'

{
    "success": true,
    "data": {
        "status": true,
        "message": "Plan changed",
        "data": {
            "_id": "69adb5e812c41a7092649860",
            "slug": "acme-corp1",
            "name": "Acme Corp Updated",
            "domain": "hr.acme1.com",
            "logoUrl": "",
            "primaryColor": "#1a73e8",
            "industry": "Technology",
            "country": "BD",
            "timezone": "Asia/Dhaka",
            "currency": "BDT",
            "locale": "en",
            "plan": "professional",
            "status": "active",
            "limits": {
                "maxEmployees": 250,
                "maxAdmins": 10,
                "maxBranches": 5,
                "storageMb": 10240,
                "apiCallsPerDay": 10000,
                "customRoles": true,
                "advancedReports": true,
                "apiAccess": true,
                "ssoEnabled": false
            },
            "trialEndsAt": "2026-03-22T17:46:16.605Z",
            "planRenewsAt": null,
            "stripeCustomerId": "",
            "stripeSubscriptionId": "",
            "enabledFeatures": [
                "recruitment",
                "payroll",
                "expense",
                "performance",
                "training",
                "asset",
                "documents",
                "reports"
            ],
            "ownerUser": null,
            "employeeCount": 0,
            "isDemo": false,
            "apiKey": "",
            "apiKeyGeneratedAt": null,
            "createdAt": "2026-03-08T17:46:16.615Z",
            "updatedAt": "2026-03-08T17:51:10.931Z",
            "id": "69adb5e812c41a7092649860"
        },
        "serverTime": "2026-03-08T17:51:11.040Z",
        "localTime": "2026-03-08T23:51:11.040Z"
    },
    "timestamp": "2026-03-08T17:51:11.040Z"
}



curl --location 'http://localhost:8040/api/v1/admin/tenants/69adb5e812c41a7092649860/toggle-feature' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw' \
--data '{
  "feature": "payroll",
  "enabled": true
}'



{
    "success": true,
    "data": {
        "status": true,
        "message": "Feature toggled",
        "data": {
            "_id": "69adb5e812c41a7092649860",
            "slug": "acme-corp1",
            "name": "Acme Corp Updated",
            "domain": "hr.acme1.com",
            "logoUrl": "",
            "primaryColor": "#1a73e8",
            "industry": "Technology",
            "country": "BD",
            "timezone": "Asia/Dhaka",
            "currency": "BDT",
            "locale": "en",
            "plan": "professional",
            "status": "active",
            "limits": {
                "maxEmployees": 250,
                "maxAdmins": 10,
                "maxBranches": 5,
                "storageMb": 10240,
                "apiCallsPerDay": 10000,
                "customRoles": true,
                "advancedReports": true,
                "apiAccess": true,
                "ssoEnabled": false
            },
            "trialEndsAt": "2026-03-22T17:46:16.605Z",
            "planRenewsAt": null,
            "stripeCustomerId": "",
            "stripeSubscriptionId": "",
            "enabledFeatures": [
                "recruitment",
                "payroll",
                "expense",
                "performance",
                "training",
                "asset",
                "documents",
                "reports"
            ],
            "ownerUser": null,
            "employeeCount": 0,
            "isDemo": false,
            "apiKey": "",
            "apiKeyGeneratedAt": null,
            "createdAt": "2026-03-08T17:46:16.615Z",
            "updatedAt": "2026-03-08T17:51:10.931Z",
            "id": "69adb5e812c41a7092649860"
        },
        "serverTime": "2026-03-08T17:51:41.599Z",
        "localTime": "2026-03-08T23:51:41.599Z"
    },
    "timestamp": "2026-03-08T17:51:41.599Z"
}


curl --location 'http://localhost:8040/api/v1/admin/tenants/suspend' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw' \
--data '{
  "tenantId": "69adb5e812c41a7092649860",
  "reason": "Payment overdue"
}'


{
    "success": true,
    "data": {
        "status": true,
        "message": "Tenant suspended",
        "data": {
            "_id": "69adb5e812c41a7092649860",
            "slug": "acme-corp1",
            "name": "Acme Corp Updated",
            "domain": "hr.acme1.com",
            "logoUrl": "",
            "primaryColor": "#1a73e8",
            "industry": "Technology",
            "country": "BD",
            "timezone": "Asia/Dhaka",
            "currency": "BDT",
            "locale": "en",
            "plan": "professional",
            "status": "suspended",
            "limits": {
                "maxEmployees": 250,
                "maxAdmins": 10,
                "maxBranches": 5,
                "storageMb": 10240,
                "apiCallsPerDay": 10000,
                "customRoles": true,
                "advancedReports": true,
                "apiAccess": true,
                "ssoEnabled": false
            },
            "trialEndsAt": "2026-03-22T17:46:16.605Z",
            "planRenewsAt": null,
            "stripeCustomerId": "",
            "stripeSubscriptionId": "",
            "enabledFeatures": [
                "recruitment",
                "payroll",
                "expense",
                "performance",
                "training",
                "asset",
                "documents",
                "reports"
            ],
            "ownerUser": null,
            "employeeCount": 0,
            "isDemo": false,
            "apiKey": "",
            "apiKeyGeneratedAt": null,
            "createdAt": "2026-03-08T17:46:16.615Z",
            "updatedAt": "2026-03-08T17:57:17.224Z",
            "id": "69adb5e812c41a7092649860"
        },
        "serverTime": "2026-03-08T17:57:17.383Z",
        "localTime": "2026-03-08T23:57:17.383Z"
    },
    "timestamp": "2026-03-08T17:57:17.383Z"
}


curl --location --request POST 'http://localhost:8040/api/v1/admin/tenants/69adb5e812c41a7092649860/reactivate' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw'

{
    "success": true,
    "data": {
        "status": true,
        "message": "Tenant reactivated",
        "data": {
            "_id": "69adb5e812c41a7092649860",
            "slug": "acme-corp1",
            "name": "Acme Corp Updated",
            "domain": "hr.acme1.com",
            "logoUrl": "",
            "primaryColor": "#1a73e8",
            "industry": "Technology",
            "country": "BD",
            "timezone": "Asia/Dhaka",
            "currency": "BDT",
            "locale": "en",
            "plan": "professional",
            "status": "active",
            "limits": {
                "maxEmployees": 250,
                "maxAdmins": 10,
                "maxBranches": 5,
                "storageMb": 10240,
                "apiCallsPerDay": 10000,
                "customRoles": true,
                "advancedReports": true,
                "apiAccess": true,
                "ssoEnabled": false
            },
            "trialEndsAt": "2026-03-22T17:46:16.605Z",
            "planRenewsAt": null,
            "stripeCustomerId": "",
            "stripeSubscriptionId": "",
            "enabledFeatures": [
                "recruitment",
                "payroll",
                "expense",
                "performance",
                "training",
                "asset",
                "documents",
                "reports"
            ],
            "ownerUser": null,
            "employeeCount": 0,
            "isDemo": false,
            "apiKey": "",
            "apiKeyGeneratedAt": null,
            "createdAt": "2026-03-08T17:46:16.615Z",
            "updatedAt": "2026-03-08T17:57:34.333Z",
            "id": "69adb5e812c41a7092649860"
        },
        "serverTime": "2026-03-08T17:57:34.385Z",
        "localTime": "2026-03-08T23:57:34.385Z"
    },
    "timestamp": "2026-03-08T17:57:34.385Z"
}



curl --location --request POST 'http://localhost:8040/api/v1/admin/tenants/69adb5e812c41a7092649860/generate-api-key' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw'


{
    "success": true,
    "data": {
        "status": true,
        "message": "API key generated — save it now",
        "data": {
            "apiKey": "acme-corp1_51f044b32a37b460f34f48a6a577b2844230fc55f56aa0231c9eb9bff07a8b4d"
        },
        "serverTime": "2026-03-08T17:57:50.670Z",
        "localTime": "2026-03-08T23:57:50.670Z"
    },
    "timestamp": "2026-03-08T17:57:50.670Z"
}


curl --location --request DELETE 'http://localhost:8040/api/v1/admin/tenants/69adb5e812c41a7092649860/revoke-api-key' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkzZTM3NWM2YTMzYjc2MTM5ZTY3MTUiLCJlbWFpbCI6InJpYW5pc2xhbS5jb2RlckBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzEzNDc4OTYsImV4cCI6MTc5NzYxMzQ5Nn0.rjrOIUQ8Ijjz7z8XXPAOVHIzUke5vn8m-TOS4y_72hw'


{
    "success": true,
    "data": {
        "status": true,
        "message": "API key revoked",
        "data": {
            "message": "API key revoked"
        },
        "serverTime": "2026-03-08T17:58:07.779Z",
        "localTime": "2026-03-08T23:58:07.779Z"
    },
    "timestamp": "2026-03-08T17:58:07.779Z"
}
