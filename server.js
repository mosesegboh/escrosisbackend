require('./config/db')

const app = require('express')()
const port = process.env.PORT || 3000

//routes
const UserRouter = require('./api/User')
const TransactionRouter = require('./api/Transaction')
const BillCategoriesRouter = require('./api/transactions/BillCategories')

//inorder to accept data
const bodyParser = require('express').json
app.use(bodyParser());

//APIs
app.use('/user', UserRouter)
app.use('/transaction', TransactionRouter)
app.use('/transaction', BillCategoriesRouter)

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})