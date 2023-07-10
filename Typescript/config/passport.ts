import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user'
import { IncrementDecrementOptionsWithBy } from 'sequelize';

export class PassportConfig {
    initialization = (passport) => {
        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(async function (user, done) {
            User.increment('login_count', <IncrementDecrementOptionsWithBy>{
                by: 1,
                where: {
                    id: user.id,
                },
            });
            
            done(null, user);
        });

        passport.use(
            new FacebookStrategy(
                {
                    clientID: process.env.FACEBOOK_APP_ID,
                    clientSecret: process.env.FACEBOOK_APP_SECRET,
                    callbackURL: process.env.FACEBOOK_APP_CALLBACK_URL,
                    profileFields: ['id', 'emails', 'displayName'],
                },
                async function (accessToken, refreshToken, profile, cb) {
                    let selectUser = await User.findOne({
                        where: {
                            registration_type: "facebook",
                            email: profile.emails[0].value,
                            social_user_id: profile.id,
                        },
                    });

                    if (selectUser != null) {
                        cb && cb(null, selectUser);
                        return;
                    }
                    const [user, status] = await User.findOrCreate({
                        where: {
                            registration_type: "facebook",
                            email: profile.emails[0].value,
                            social_user_id: profile.id,
                            name: profile.displayName,
                        },
                    });

                    cb(null, user);
                }
            )
        );

        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    callbackURL: process.env.GOOGLE_APP_CALLBACK_URL,
                    profileFields: ['id', 'emails', 'displayName'],
                },
                async function (accessToken, refreshToken, profile, cb) {
                    let selectUser = await User.findOne({
                        where: {
                            registration_type: "google",
                            email: profile.emails[0].value,
                            social_user_id: profile.id,
                        },
                    });

                    if (selectUser != null) {
                        cb && cb(null, selectUser);
                        return;
                    }
                    const [user, status] = await User.findOrCreate({
                        where: {
                            registration_type: "google",
                            name: profile.displayName,
                            social_user_id: profile.id,
                            email: profile.emails[0].value,
                        },
                    });

                    cb(null, user);
                }
            )
        );
    }
}