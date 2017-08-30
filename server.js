const express = require('express')
const morgan = require('morgan')
const basicAuth = require('express-basic-auth')

const app = express()

const authMiddleware = basicAuth({
  users: { 'admin': '1234' },
  challenge: true,
  realm: 'Imb4T3st4pp'
})

app.set('view engine', 'ejs')
app.use('/static', express.static('public'))
app.use(morgan('tiny'))

app.get('/', authMiddleware, (req,res)=>{
  res.render('index.ejs');
})

app.listen(3000, ()=>{
  console.log('server start...')
})