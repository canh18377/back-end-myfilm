const express= require('express')
const router =express.Router()
const AccountController= require("../app/Controller/AccountController")
router.post('/create',AccountController.createAccount)
router.post('/',AccountController.generateToken)
module.exports=router