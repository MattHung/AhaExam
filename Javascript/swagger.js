import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: "1.0.0",
        title: "My API",
        description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
    },
    host: "https://jd-feve.vip/AhaExam/",
    basePath: "/",
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "User",
            "description": "Endpoints"
        }
    ],
    securityDefinitions: {
        apiKeyAuth:{
            type: "apiKey",
            in: "cookie",       // can be "header", "query" or "cookie"
            name: "connect.sid",  // name of the header, query parameter or cookie
            description: "session cookie"
        }
    },
    definitions: {
        user: {
            name: {
                "type": "username",
                "description": "user name"
            },
            email: {
                "type": "xxxx@email.com",
                "description": "user email"
            },
            registration_type: {
                "type": "email",
                "description": "user registration types, 'email','google','facebook'"
            },
            social_user_id: {
                "type": 1,
                "description": "user social_user_id account id"
            },
            password: {
                "type": "y723dpassword",
                "description": "user defined password if singup from email"
            },
            verify_token: {
                "type": "verify_token",
                "description": "user auto generate token for verification"
            },
            verifiedAt: {
                "type": "2023-07-08 02:17:48",
                "description": "user verify email time"
            },
            createdAt: {
                "type": "2023-07-08 02:17:48",
                "description": "user account created time"
            },
        },
        RegisterApiResult: {
            succeed: {
                "type": true,
                "description": "this requst succeed or not"
            },
            message: {
                "type": "succeeed!",
                "description": "detail message about this request"
            },
            verify_token: {
                "type": "verify_token",
                "description": "token for verify email account"
            },
        },
        LoginApiResult: {
            succeed: {
                "type": true,
                "description": "this requst succeed or not"
            },
            message: {
                "type": "succeeed!",
                "description": "detail message about this request"
            },
            resendEmail: {
                "type": true,
                "description": "notify user if user call login but not verify email yet"
            },
            user: { $ref: "#/definitions/user"},
        },
        ApiResult: {
            succeed: {
                "type": true,
                "description": "this requst succeed or not"
            },
            message: {
                "type": "succeeed!",
                "description": "detail message about this request"
            },
        },
        VerifyApiResult: {
            succeed: {
                "type": true,
                "description": "this requst succeed or not"
            },
            message: {
                "type": "succeeed!",
                "description": "detail message about this request"
            },
            user: { $ref: "#/definitions/user"},
        },

        DashBoardSummuryApiResult: {
            user_name: {
                "type": "user name",
                "description": "the user name"
            },
            registration_type: {
                "type": "email!",
                "description": "user registration type"
            },
            timestamp_signedup: {
                "type": "2023-07-09 08:18:19!",
                "description": "the time when user sign up"
            },
            count_loggedin: {
                "type": "100!",
                "description": "user visit/login times"
            },
            timestamp_last_session: {
                "type": "2023-07-09 08:18:19!",
                "description": "last time user visit/login timestamp"
            },
        },

        DashBoardStatisticApiResult: {
            totalSignup: {
                "type": 100,
                "description": "total signed up users"
            },
            totalTodayActive: {
                "type": 100,
                "description": "today active user count"
            },
            averageActiveIn7Days: {
                "type": "2023-07-09 08:18:19!",
                "description": "average active user count in 7 days"
            },
        },
    }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./controller/controller_user.js', './controller/controller_dashboard.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
    // await import('./App.js')
})