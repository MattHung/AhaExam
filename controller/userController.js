import { UserService } from '../service/userService.js'

export class UserController{
    constructor() {
        this.service_ = new UserService();
    }

    //user register logic
    submitRegister = async (req, res) => {
        if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
            res.json(this.service_.getAPIResult(false, "invalid parameters!"));
            return;
        }

        let apiRes = await this.service_.apiRegister(req.body.username, req.body.email, req.body.password);
        res.json(apiRes);
    }

    //user email verification logic
    submitVerify = async (req, res) => {
        let token = req.body.token;
        let apiRes = null;
        if (!token || token === "") {
            apiRes = this.service_.getAPIResult(false, "verify failed, token is empty!");
            res.json(apiRes);
            return;
        }

        apiRes = await this.service_.apiVerify(token);

        if (apiRes.succeed) {
            this.service_.userSessionLogin_(req, apiRes.user, (err) => {
                if (err)
                    apiRes = this.service_.getAPIResult(false, err.message);

                res.json(apiRes);
            });
        }
        else {
            apiRes = this.service_.getAPIResult(false, apiRes.message);
            res.json(apiRes);
        }
    }

    //user login logic
    submitLogin = async (req, res) => {
        if (!req.body || !req.body.email || !req.body.password) {
            res.json(this.service_.getAPIResult(false, "invalid parameters!"));
            return;
        }

        let apiRes = await this.service_.apiLogin(req.body.email, req.body.password);
        if (apiRes.resendEmail)
            req.session.resend_email = true;

        if (apiRes.succeed) {
            this.service_.userSessionLogin_(req, apiRes.user, (err) => {
                if (err)
                    apiRes = this.service_.getAPIResult(false, err.message);

                res.json(apiRes);
            });
        } else {
            res.json(apiRes);
        }
    }

    //user resend email logic
    resendemail = async (req, res) => {
        if (!req.body || !req.body.email) {
            res.json(this.service_.getAPIResult(false, "invalid parameters!"));
            return;
        }

        let result = await this.service_.apiSendEmailVerify(req.body.email);
        res.json(result);
    }

    //user reset password logic
    submitResetpassword = async (req, res) => {
        if (!req.body || !req.body.email || !req.body.oldpassword || !req.body.newpassword) {
            res.json(this.service_.getAPIResult(false, "invalid parameters!"));
            return;
        }

        let apiRes = await this.service_.apiResetPassword(req.body.email, req.body.oldpassword, req.body.newpassword);
        res.json(apiRes);
    }

    //user change user name logic
    submitChangeUserName = async (req, res) => {
        if (!req.body || !req.body.email || !req.body.username) {
            res.json(this.service_.getAPIResult(false, "invalid parameters!"));
            return;
        }

        let apiRes = null;
        if (!req.user) {
            apiRes = this.service_.getAPIResult(false, "please login first for change username");
            res.json(apiRes);
            return;
        }

        apiRes = await this.service_.apiChangeUserName(req.user.registration_type, req.body.email, req.body.username);

        if (apiRes.succeed)
            req.user.name = req.body.username;

        res.json(apiRes);
    }

    //user logout action
    handleLogout = (req, res) => {
        let apiRes = null;
        if (!req.user) {
            apiRes = this.service_.getAPIResult(false, "please login first");
            res.json(apiRes);
            return;
        }

        req.logout(() => {
            apiRes = this.service_.getAPIResult(true, "succeed");
            res.json(apiRes);
        });
    }
}