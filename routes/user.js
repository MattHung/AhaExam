import express from 'express';
import { UserController } from '../controller/userController.js'

const router = express.Router();
const userController = new UserController();

router.post('/register', (req, res) => {
    /* 	#swagger.tags = ['User'] */

    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User register by email.',
            required: true,
            schema: {
                username: 'testUserName',
                email: 'xxxxx@email.com',
                password: 'password',
            }
    } */

    /* #swagger.responses[200] = {
            description: 'request successfully processed.',
            schema: { $ref: "#/definitions/RegisterApiResult" }
    } */

    userController.submitRegister(req, res);
});

router.post('/verify', (req, res) => {
    /* 	#swagger.tags = ['User'] */

    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Verify email if User register by email.',
            required: true,
            schema: {
                token: 'testToken',
            }
    } */

    /* #swagger.responses[200] = {
            description: 'request successfully processed.',
            schema: { $ref: "#/definitions/VerifyApiResult" }
    } */

    userController.submitVerify(req, res);
});

router.post('/login', (req, res) => {
    /* 	#swagger.tags = ['User'] */

    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User login by email.',
            required: true,
            schema: {
                email: 'xxxxx@email.com',
                password: 'password',
            }
    } */

    /* #swagger.responses[200] = {
            description: 'request successfully processed.',
            schema: { $ref: "#/definitions/LoginApiResult" }
    } */

    userController.submitLogin(req, res);
});

router.post('/resendemail', (req, res) => {
    /* 	#swagger.tags = ['User'] */

    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Resend email if User register by email and try to login before email verification.',
            required: true,
            schema: {
                email: 'xxxxx@email.com',
            }
    } */

    /* #swagger.responses[200] = {
            description: 'request successfully processed.',
            schema: { $ref: "#/definitions/ApiResult" }
    } */

    userController.resendemail(req, res);
});

router.post('/resetpassword', (req, res) => {
    /* 	#swagger.tags = ['User'] */

    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User reset password.',
            required: true,
            schema: {
                email: 'xxxxx@email.com',
                oldpassword: 'oldpassword',
                newpassword: 'newpassword',
            }
    } */

    /* #swagger.responses[200] = {
            description: 'request successfully processed.',
            schema: { $ref: "#/definitions/ApiResult" }
    } */

    userController.submitResetpassword(req, res);
});

router.post('/changeusername', (req, res) => {
    /* 	#swagger.tags = ['User'] */

    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User change name.',
            required: true,
            schema: {
                email: 'xxxxx@email.com',
                username: 'newUserName',
            }
    } */

    /* #swagger.responses[200] = {
            description: 'request successfully processed.',
            schema: { $ref: "#/definitions/ApiResult" }
    } */

    userController.submitChangeUserName(req, res);
});

router.get('/logout', (req, res) => {
    /* 	#swagger.tags = ['User'] */

    /* #swagger.security = [{
        "apiKeyAuth": []
    }] */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User logout and clear session.',
            required: true,
            schema: {}
    } */

    /* #swagger.responses[200] = {
            description: 'request successfully processed.',
            schema: { $ref: "#/definitions/ApiResult" }
    } */

    userController.handleLogout(req, res);
});

export {router};