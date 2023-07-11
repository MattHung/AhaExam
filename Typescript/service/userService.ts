import * as crypto from 'crypto';
import * as util from 'util';
import MailService from '@sendgrid/mail';
import mailer from 'nodemailer'
import { User } from '../models/user.js';

enum RegistrationType {
    email = "email",
    facebookl = "facebookl",
    googlel = "googlel",
};

//core logic class for all features
export interface ApiResult {
    succeed: boolean;
    message: string;
    resendEmail?: Boolean;
    user?: User;
    verify_token?: string;
};

/*
 * UserService
 *
 * user-related back-end api logic
 */
export class UserService {
    getAPIResult(succeed: boolean, message: string): ApiResult {
        return <ApiResult>{
            succeed: succeed,
            message: message,
        };
    }

    /**
     * send email to user
     *
     * @param {string} targetEmail The specific user email
     * @param {string} username The user name
     * @param {string} token The email verification token
     * @return {void} 
     */
    sendVerifyEmail_ = async (targetEmail: string, username: string, token: string): Promise<void> => {
        //use google smtp for send email
        let sendEmailViaGoogleSmtp = async (): Promise<void> => {
            let smtpProtocol = mailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                service: "Gmail",
                auth: {
                    user: process.env.GMAIL_APP_USERNAME,
                    pass: process.env.GMAIL_APP_PASSWORD,
                }
            });

            let mailoption = {
                from: "no-reply@gmail.com",
                to: targetEmail,
                subject: "AhaExam please verify your email",
                html: text
            }

            //use google smtp for send mail
            let info = await smtpProtocol.sendMail(mailoption);
            console.log(info);
        };

        //use send grid service for send email
        let sendEmailViaSendGrid = async (): Promise<void> => {
            MailService.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: targetEmail, // Change to your recipient
                from: process.env.SENDGRID_SENDER, // Change to your verified sender
                subject: "AhaExam please verify your email",
                html: text,
            };

            await MailService.send(msg).then(() => {
                console.log('Email sent');
            });
        }

        let link = util.format("<a href=\"%s/verify?token=%s\">Verify Email</a>", process.env.EMAIL_VERIFY_HOST, token);
        let text = util.format(
            "<html>" +
            "<head></head>" +
            "<body>" +
            "<p>Hello %s!</p>" +
            "<p>" +
            "Thanks for your interest in creating an AhaExam account. <br/>" +
            "To create your account, please verify your email address by clicking below." +
            "</p>" +
            "<br/>" +
            "%s" +
            "<br/><br/>" +

            "<p>Thanks for your support.</p>" +
            "<p>AhaExam Team.</p><br/>" +
            "</body>" +
            "</html>"
            , username, link);



        await sendEmailViaGoogleSmtp();
        // await sendEmailViaSendGrid();
    };

    /**
     * user session login, use cookie for identity user session
     *
     * @param {request} req The incomming request
     * @param {User}    user The model
     * @param {function} callback callback if login completed
     * @return {void} 
     */
    userSessionLogin_ = (req, user, callback: Function): void => {
        req.logIn(user, {}, function (err) {
            callback(err);
        });
    }

    /**
     * check password rules
     *
     * @param {string} password The password to check
     * @return {void} 
     */
    checkPasswordvalidity_(password: string): string {
        // contains at least 8 characters
        if (password.length < 8)
            return 'password should contains at least 8 characters';

        // contains at least one lower character
        if (password.search(/[a-z]/) < 0)
            return 'password should contains at least one lower character';

        // contains at least one upper character
        if (password.search(/[A-Z]/) < 0)
            return 'password should contains at least one upper character';

        // contains at least one digit character
        if (password.search(/[0-9]/) < 0)
            return 'password should contains at least one digit character';

        // contains at least one special character
        if (password.search(/[!@#$%^&*]/) < 0)
            return 'password should contains at least one special character';

        return "";
    }

    /**
     * the login api
     *
     * @param {string} email The user email
     * @param {string} password The user password
     * @return {object} the api result 
     */
    apiLogin = async (email: string, password: string): Promise<ApiResult> => {
        try {
            let invalidPassword = this.checkPasswordvalidity_(password);
            if (invalidPassword !== "")
                return this.getAPIResult(false, invalidPassword);

            password = crypto.createHash('md5').update(password).digest("hex");
            let user = await User.findOne({
                where: {
                    email: email,
                    password: password,
                },
            });

            if (!user)
                return this.getAPIResult(false, "login failed, invalid email or password!");

            if (user.verifiedAt == null) {
                let res = this.getAPIResult(false, 'login failed, please verify your email fist!');
                res.resendEmail = true;
                return res;
            }

            let res = this.getAPIResult(true, "succeed!");
            res.user = user;
            return res;
        } catch (e) {
            console.error(e);
            return this.getAPIResult(false, e.message);
        }
    }

    /**
     * the send verification email api
     *
     * @param {string} email The user email
     * @return {object} the api result 
     */
    apiSendEmailVerify = async (email: string): Promise<ApiResult> => {
        try {
            let user = await User.findOne({
                where: {
                    email: email,
                    registration_type: "email",
                },
            });

            if (!user)
                return this.getAPIResult(false, "invalid email.");

            await this.sendVerifyEmail_(user.email, user.name, user.verify_token);

            return this.getAPIResult(true, "resend email verification succeed!");
        } catch (e) {
            return this.getAPIResult(false, e.message);
        }
    }

    /**
     * the register api
     *
     * @param {string} username The user name
     * @param {string} email The user email
     * @param {string} password The user password
     * @return {object} the api result 
     */
    apiRegister = async (username: string, email: string, password: string): Promise<ApiResult> => {
        let invalidPassword = this.checkPasswordvalidity_(password);
        if (invalidPassword !== "")
            return this.getAPIResult(false, invalidPassword);

        let error_message = "";

        password = crypto.createHash('md5').update(password).digest("hex");
        let token = "";
        try {
            token = username + email + new Date().getTime();
            token = crypto.createHash('md5').update(token).digest("hex");

            await User.create({
                registration_type: "email",
                email: email,
                name: username,
                password: password,
                verify_token: token,
            });

            await this.apiSendEmailVerify(email);
        } catch (e) {
            if (e.original.sqlState === '23000')
                error_message = "duplicate email, please type a new one";
            else
                error_message = e.message;

            return this.getAPIResult(false, error_message);
        }

        let apiRes = this.getAPIResult(true, "register succeed, please check your email.");
        apiRes.verify_token = token;
        return apiRes;
    }

    /**
     * the email verification api
     *
     * @param {string} token email verification token, generate from register api
     * @return {object} the api result 
     */
    apiVerify = async (token: string): Promise<ApiResult> => {
        try {
            let user = await User.findOne({
                where: {
                    verify_token: token,
                },
            });

            if (!user)
                return this.getAPIResult(false, "verify failed, invalid token!");

            if (user.verifiedAt != null) {
                let res = this.getAPIResult(true, "succeed!");
                res.user = user;
                return res;
            }

            await User.update(
                { verifiedAt: new Date() },
                {
                    where: {
                        verify_token: token,
                    }
                }
            );

            let res = this.getAPIResult(true, "succeed!");
            res.user = user;
            return res;
        } catch (e) {
            return this.getAPIResult(false, e.message);
        }
    }

    /**
     * the change username api
     *
     * @param {string} registration_type user register types 'email','google','facebook'
     * @param {string} email user email
     * @param {string} newUserName the new user name that user input.
     * @return {object} the api result 
     */
    apiChangeUserName = async (registration_type: RegistrationType, email: string, newUserName: string): Promise<ApiResult> => {
        try {
            await User.update(
                { name: newUserName },

                {
                    where: {
                        registration_type: registration_type,
                        email: email,
                    }
                }
            );

            return this.getAPIResult(true, "succeed!");
        } catch (e) {
            return this.getAPIResult(false, e.message);
        }
    }

    /**
     * the reset password api
     *
     * @param {string} email user email
     * @param {string} oldPassword user original password
     * @param {string} newPassword new password that user wants to.
     * @return {object} the api result 
     */
    apiResetPassword = async (email: string, oldPassword: string, newPassword: string): Promise<ApiResult> => {
        let invalidPassword = this.checkPasswordvalidity_(newPassword);
        if (invalidPassword !== "")
            return this.getAPIResult(false, invalidPassword);

        try {
            oldPassword = crypto.createHash('md5').update(oldPassword).digest("hex");
            newPassword = crypto.createHash('md5').update(newPassword).digest("hex");

            let user = await User.findOne({
                where: {
                    registration_type: "email",
                    email: email,
                },
            });

            if (!user)
                return this.getAPIResult(false, "invalid email");

            let result = await User.update(
                { password: newPassword },

                {
                    where: {
                        registration_type: "email",
                        email: email,
                        password: oldPassword,
                    }
                }
            );

            if (result[0] === 0)
                return this.getAPIResult(false, "old password mismatch, please try again!");

            return this.getAPIResult(true, "succeed! please use new password to login");
        } catch (e) {
            return this.getAPIResult(false, e.message);
        }
    }
}