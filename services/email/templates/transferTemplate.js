const success = ({transactionId,  amount,  transactionType, details, status}) => {
    const subject = status == 'success' ? `Your Transfer Is Successful` : `Your Transfer Has Been Initiated`

    const body = `<html>
        <head>
            <img src="${process.env.EMAIL_HEADER_BANNER}">
        </head>
        <hr>
        <body>
            <p>Hello Customer,</p>
            <p>${status == 'success' ? 'This is to notify you that your transfer is now successful' : 'This is to notify you that a transfer has been initiated in your favour'}</p>
            <p>Here are the details of the transaction:</p>
            <p><b>Transaction ID: ${transactionId}</b></p>
            <p><b>Amount: ${amount}</b></p>
            <p><b>Transaction Leg: ${transactionType}</b></p>
            <p><b>Transaction Status: ${status}</b></p>
            <p><b> Details: ${details}</b></p>
            <p><b> Kindly download and install our app on: <a href="${process.env.GOOGLE_PLAYSTORE_URL}">playstore</a></b>
                or <a href="${process.env.APPLE_APP_STORE_URL}">appstore</a> to lock and confirm the transaction.
            </p>
            <p>Thank you for trusting us, your transaction is in safe hands.</p>
            <p>Warm Regards</p>
        </body>
        <hr>
        <footer>
            <p><a href="https://www.escrosispayments.com">www.escrosispayments.com</a></p>
            <img src="${process.env.EMAIL_FOOTER_BANNER}">
        </footer>
    </html>`
    const params = {subject: subject,body: body}
    return params
}

const failed = ({transactionId,  amount,  transactionType, details, status}) => {
    const subject = `Your Transfer Has Failed` 

    const body = `<html>
            <head>
                <img src="${process.env.EMAIL_HEADER_BANNER}">
            </head>
            <hr>
            <body>
                <p>Hello Customer,</p>
                <p>This is to notify you that your transfer transaction has failed</p>
                <p>Here are the details of the transaction:</p>
                <p><b>Transaction ID: ${transactionId}</b></p>
                <p><b>Amount: ${amount}</b></p>
                <p><b> Transaction Leg: ${transactionType}</b></p>
                <p><b>Transaction Status: ${status}</b></p>
                <p><b> Details: ${details}</b></p>
                <p><b> Kindly download and install our app on: <a href="${process.env.GOOGLE_PLAYSTORE_URL}">playstore</a></b>
                    or <a href="${process.env.APPLE_APP_STORE_URL}">appstore</a> to lock and confirm the transaction.
                </p>
                <p>Thank you for trusting us, your transaction is in safe hands.</p>
                <p>Warm Regards</p>
            </body>
            <hr>
            <footer>
                <p><a href="https://www.escrosispayments.com">www.escrosispayments.com</a></p>
                <img src="${process.env.EMAIL_FOOTER_BANNER}">
            </footer>
        </html>`

    const params = {subject: subject,body: body}
    return params 
}

module.exports = {success,failed} 