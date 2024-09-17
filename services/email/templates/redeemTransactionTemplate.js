const success = ({transactionId,  amount,  status, redemptionDate, transactionCurrency, details}) => {
        
    const subject = `Your Escrow Transaction Has Now Been Redeemed`

    const body = `<html>
        <head>
            <img
                src="${process.env.EMAIL_HEADER_BANNER ?? 'https://www.mozetty.com/wp-content/uploads/2018/02/mozetty_com-1.jpg'}" 
                alt="escrosis_logo"
            >
        </head>
        <hr>
        <body>
            <p>Hello Customer,</p>
            <p>This is to notify you that your escrow transaction has been redeemed!</p>
            <p>Here are the details of the transaction:</p>
            <p><b>Transaction ID: ${transactionId}</b></p>
            <p><b>Amount: ${amount}</b></p>
            <p><b>Transaction Currency: ${transactionCurrency}</b></p>
            <p><b>Transaction Redemption Date: ${redemptionDate}</b></p>
            <p><b>Transaction Status: ${status}</b></p>
            <p><b>Details: ${details}</b></p>
            <p><b>Kindly download and install our app on: ${process.env.GOOGLE_PLAYSTORE_URL ?? 'https://play.google.com/store/games'}</b></p>
            <p>Thank you for trusting us, your transaction is in safe hands.</p>
            <p>Warm Regards</p>
        </body>
        <hr>
        <footer>
            <p><a href="https://www.escrosispayments.com">www.escrosispayments.com</a></p>
            <img
                src="${process.env.EMAIL_FOOTER_BANNER ?? 'https://www.mozetty.com/wp-content/uploads/2018/02/mozetty_com-1.jpg'}" 
                alt="escrosis_logo"
            >
        </footer>
    </html>`

    const params = {subject: subject, body: body}
    return params
}


const failed = ({transactionId,  amount,  status, transactionDate, transactionCurrency, details}) => {
    const subject = `Your Escrow Transaction Has Failed To Be Redeemed`

    const body = `<html>
            <head>
                <img
                    src="${process.env.EMAIL_HEADER_BANNER ?? 'https://www.mozetty.com/wp-content/uploads/2018/02/mozetty_com-1.jpg'}" 
                    alt="escrosis_logo"
                >
            </head>
            <hr>
            <body>
                <p>Hello Customer,</p>
                <p>This is to notify you that an escrow transaction failed to be cancelled</p>
                <p>Here are the details of the transaction:</p>
                <p><b>Transaction ID: ${transactionId}</b></p>
                <p><b>Amount: ${amount}</b></p>
                <p><b>Transaction Currency: ${transactionCurrency}</b></p>
                <p><b>Transaction Redemption Date: ${transactionDate}</b></p>
                <p><b> Transaction Status: ${status}</b></p>
                <p><b> Details: ${details}</b></p>
                <p><b> Kindly download and install our app on: ${process.env.GOOGLE_PLAYSTORE_URL ?? 'https://www.mozetty.com/wp-content/uploads/2018/02/mozetty_com-1.jpg'}</b></p>
                <p>Thank you for trusting us, your transaction is in safe hands.</p>
                <p>Warm Regards</p>
            </body>
            <hr>
            <footer>
                <p><a href="https://www.escrosispayments.com">www.escrosispayments.com</a></p>
                <img
                    src="${process.env.EMAIL_FOOTER_BANNER ?? 'https://www.mozetty.com/wp-content/uploads/2018/02/mozetty_com-1.jpg'}" 
                    alt="escrosis_logo"
                >
            </footer>
        </html>`

    const params = {subject: subject,body: body}
    return params
}

module.exports = {success,failed}