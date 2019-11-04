const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use('/members', (req, res, next) => {
    res.send(global.users)
});

router.use('/profile', (req, res, next) => {
    res.send(req.user)
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res. render('join');
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login');
});

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const {email, password } = req.body;
    try {
        const user = global.users[email];
        if (user) {
            return next('이미 가입된 이메일입니다.')
        }
        const hash = await bcrypt.hash(password, 12);
        global.users[email] = {
            email,
            password: hash
        }
        return res.redirect('/members');
    } catch (error) {
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            return next(authError)
        }
        if (!user) {
            return next(info.message);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                return next(loginError);
            } else {
                return res.redirect('/profile');
            }
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;