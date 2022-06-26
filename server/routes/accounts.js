const { Router } = require('express')
const Account = require('../models/account.js')
const sanitize = require('mongo-sanitize')
const bcrypt = require("bcrypt");
const RefreshToken = require('../models/refreshToken.js')
const config = require("../auth.config");
const jwt = require("jsonwebtoken");

const router = Router()

router.get('/', async (req, res) => {
    try {
        const accountList = await Account.find()
        if (!accountList) throw new Error('No Account List found')
        res.status(200).json(accountList)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/register', async (req, res) => {
    const newAccount = new Account({firstName: sanitize(req.body.firstName), lastName: sanitize(req.body.lastName), email: sanitize(req.body.email), password: bcrypt.hashSync(sanitize(req.body.password), 9)})
    try {
        const account = await newAccount.save()
        if (!account) throw new Error('Something went wrong saving the account')
        res.status(200).json("Account created successfully")
    } catch (error) {
        if(error.code === 11000) {
            res.status(500).json({ message: 'Account with the same email already exists' })
        }
        else{
            res.status(500).json({ message: error.message })
        }
    }
})

router.post('/login', async (req, res) => {
    try {
        const account = await Account.findOne({ email: sanitize(req.body.email)}).exec()
        if (!account) throw new Error('This account does not exist')
        var passwordIsValid = bcrypt.compareSync(
            sanitize(req.body.password),
            account.password
        );
        if (!passwordIsValid) throw new Error('This account does not exist')
        let token = jwt.sign({ id: account._id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });
        let refreshToken = await RefreshToken.createToken(account);
        res.status(200).send({
            accessToken: token,
            refreshToken: refreshToken,
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/refreshToken', async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }
    try {
        let refreshToken = await RefreshToken.findOne({ token: requestToken });
        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }
        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
            
            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }
        let newAccessToken = jwt.sign({ id: refreshToken.accountId }, config.secret, {
            expiresIn: config.jwtExpiration,
        });
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
})

router.post('/logout', async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }
    try {
        let refreshToken = await RefreshToken.findOne({ token: requestToken });
        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }
        RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
        return res.status(200).json({
            refreshToken: requestToken,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
})

router.delete('/delete/:email', async (req, res) => {
    const { email } = req.params
    try {
        const removed = await Account.findOneAndDelete(email)
        if (!removed) throw Error('Something went wrong ')
        res.status(200).json("Deleted successfully")
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router