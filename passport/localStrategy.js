const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {

        try {
            const user = global.users[email]
            if (user) {
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    done(null, user); // login 성공
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.'});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};