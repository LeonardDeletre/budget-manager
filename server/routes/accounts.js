const { Router } = require('express')
const Account = require('../models/account.js')

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
    const newAccount = new Account(req.body)
    try {
        const account = await newAccount.save()
        if (!account) throw new Error('Something went wrong saving the account')
        res.status(200).json(account)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/delete/:email', async (req, res) => {
    const { email } = req.params
    try {
        const removed = await Account.findOneAndDelete(email)
        if (!removed) throw Error('Something went wrong ')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router