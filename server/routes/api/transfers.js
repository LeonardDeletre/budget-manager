const { Router } = require('express')
const Transfer = require('../../models/transfer.js')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const transferList = await Transfer.find()
        if (!transferList) throw new Error('No Transfer List found')
        res.status(200).json(transferList)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    console.log(req.body);
    const newTransfer = new Transfer(req.body)
    console.log(newTransfer.email);
    try {
        const transfer = await newTransfer.save()
        if (!transfer) throw new Error('Something went wrong saving the transfer')
        res.status(200).json(transfer)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:email', async (req, res) => {
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