const express = require('express')
const router = express.Router()
// const ObjectID = require('mongodb')
const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')
const config = require('config')
// const User = require('./../models/User')
// const UserVerification = require('./../models/UserVerification')
// const UserOTPVerification = require('./../models/UserOTPVerification')
// const sendVerificationEmail = require('../services/index')
// const nodemailer = require('nodemailer')



router.post('/feedback', (req, res) => {
   console.log('i was hit o')
})