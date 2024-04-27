const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    }
})
  
transporter.verify((error, success) => {
    if(error) {
        console.log(error)
    }else{
        console.log('ready for messages')
        console.log(success)
    }
})

const sendEmailFunction  = async (
    {   email, 
        transactionId, 
        redemptionDate, 
        amount, 
        transactionType, 
        details, 
        secondPartyEmail, 
        secondLegTransactionId, 
    }, res, status, {success, failed}) => {
    try {
        if (status == "success" || status == "pending"){
            var recipient = secondPartyEmail ? `${email}, ${secondPartyEmail}` : email;
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: recipient,
                subject: success({email, transactionId, redemptionDate, amount, transactionType, details, status, secondLegTransactionId}).subject,
                html: success({email, transactionId, redemptionDate, amount, transactionType, details, status, secondLegTransactionId}).body,
            }
        }

        if (status == "failed") {
            var recipient = secondPartyEmail ? `${email}, ${secondPartyEmail}` : email;
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: recipient,
                subject: failed({email, transactionId, redemptionDate, amount, transactionType, details, status, secondLegTransactionId}).subject,
                html: failed({email, transactionId, redemptionDate, amount, transactionType, details, status, secondLegTransactionId}).body,
            }
        }
        await transporter.sendMail(mailOPtions)
    } catch (error) {
        console.log(error.message, 'error from mail')
        return res.json({
            status: "FAILED",
            message: error.message,
        })
    }
}

module.exports = {sendEmailFunction}  