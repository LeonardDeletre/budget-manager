const { Router } = require('express')
const Transfer = require('../models/transfer.js')
const Account = require('../models/account.js')
const authJwt = require('../middlewares/authJwt')
const router = Router()


router.get('/:email', [authJwt], async (req, res) => {
    try {
        const account = await Account.findById(req.userId)
        if(account.email!==req.params.email) throw new Error('You are not authorized to access these data')
        const transferList = await Transfer.find({ accountEmail: req.params.email })
        if (!transferList) throw new Error('No Transfer List found')
        res.status(200).json(transferList)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/add', [authJwt], async (req, res) => {
    // console.log("Inside add transfer: "+ req.body)
    const account = await Account.findById(req.userId)
    if(account.email!==req.body.accountEmail) throw new Error('You are not authorized to add these data')
    try {
        const newTransfer = new Transfer(req.body)
        const transfer = await newTransfer.save()
        if (!transfer) throw new Error('Something went wrong saving the transfer')
        // const transferList = await Transfer.find({ accountEmail: newTransfer.accountEmail })
        // if (!transferList) throw new Error('No Transfer List found')
        res.status(200).json(transfer)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/delete/:email', [authJwt], async (req, res) => {
    const account = await Account.findById(req.userId)
    if(account.email!==req.params.email) throw new Error('You are not authorized to add these data')
    const { email } = req.params
    try {
        const removed = await Transfer.findOneAndDelete(email)
        if (!removed) throw Error('Something went wrong ')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
