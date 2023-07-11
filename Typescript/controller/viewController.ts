import passport from 'passport'
import { UserService } from '../service/userService.js'

/*
 * ViewController
 *
 * handle all view request that render front-end views
 */

export class ViewController {
    service_: UserService = null;

    constructor() {
        this.service_ = new UserService();
    }

    renderPage_ = (req, res, pageName, errorMsg = null, resendEmail = null) => {
        res.render(pageName, {
            user: req.user,
            error_message: errorMsg,
            resend_email: resendEmail,
        });
    }

    redirectToHomeWithErrorMessage = (req, res, error_message) => {
        req.session.error_message = error_message;
        res.redirect(process.env.BASE_URL);
    }

    //home / login page view
    home = (req, res) => {
        let errMsg = req.session.error_message;
        let resendEmail = req.session.resend_email;
        req.session.error_message = null;
        req.session.resend_email = null;

        if (req.user){
            this.renderPage_(req, res, "statistics.ejs");
        }else{
            this.renderPage_(req, res, "login.ejs", errMsg, resendEmail);
        }
    }

    //register page view
    register = (req, res) => {
        this.renderPage_(req, res, "register.ejs", null);
    }

    //user email verification view page
    verify = (req, res) => {
        this.renderPage_(req, res, "verify.ejs", null);
    }

    //user reset password view page
    resetpassword = (req, res) => {
        this.renderPage_(req, res, "resetpassword.ejs", null);
    }

    //user change user name view page
    changeUserName = (req, res) => {
        this.renderPage_(req, res, "changeusername.ejs", null);
    }

    //facebook login request
    getFacebookLogin = (req, res) => {
        passport.authenticate('facebook', { scope: ['public_profile', 'email'] })(req, res);
    };

    handleFacebookLogin = (req, res, next) => {
        passport.authenticate('facebook', { successRedirect: '/' }, (err, user, info, status) => {
            if (err) {
                this.redirectToHomeWithErrorMessage(req, res, "facebook login failed");
                return next(err);
            }

            if (!user){
                return res.redirect(process.env.BASE_URL);
            }

            this.service_.userSessionLogin_(req, user, (err) => {
                if (err) {
                    this.redirectToHomeWithErrorMessage(req, res, err.message);
                    return;
                }

                res.redirect(process.env.BASE_URL);
            });
        })(req, res, next);
    };

    //google login request
    getGoogleLogin = (req, res) => {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
    };

    handleGoogleLogin = (req, res, next) => {
        passport.authenticate('google', { successRedirect: './AhaExam/' }, (err, user, info, status) => {
            if (err) {
                this.redirectToHomeWithErrorMessage(req, res, "google login failed");
                return next(err);
            }

            if (!user){
                return res.redirect(process.env.BASE_URL);
            }

            this.service_.userSessionLogin_(req, user, (err) => {
                if (err) {
                    this.redirectToHomeWithErrorMessage(req, res, err.message);
                    return;
                }

                res.redirect(process.env.BASE_URL);
            });
        })(req, res, next);
    };
}