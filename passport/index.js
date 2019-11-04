const local = require('./localStrategy');

module.exports = (passport) => {
    passport.serializeUser((user, done) => { // login 성공시
        done(null, user.email);
    });

    passport.deserializeUser((email, done) => { // 요청시 반드시 호출
        const user = global.users[email]
        if (user) {
            done(null, user)
        } else {
            done("Not user")
        }
    });

    local(passport);
};