const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/main');
        return;
    }
    res.redirect('/visitor');
});

router.get('/main', async (req, res) => {
    if (req.session.user) {
        res.render('private/main', { layout: false });
        return;
    }
    res.redirect('/visitor');
});

router.get('/entry', async (req, res) => {
    if (req.session.user) {
        res.redirect('/main');
        return;
    }
    res.render('public/entry', { layout: false });
});

router.get('/user', async (req, res) => {
    if (req.session.user) {
        res.render('private/user', { layout: false });
        return;
    }
    res.redirect('/visitor');
});

router.get('/visitor', async (req, res) => {
    res.render('public/visitor', { layout: false });
});



// router.get('/admin', async (req, res) => {
//     if (req.session.user) {
//         res.render('admin/admin', { layout: false });
//         return;
//     }
//     res.redirect('/entry');
// });

module.exports = router;
