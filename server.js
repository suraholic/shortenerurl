const express = require('express')
const morgan = require('morgan')
const basicAuth = require('express-basic-auth')
const randomstring = require("randomstring")
const bodyParser = require('body-parser')

const app = express()

const authMiddleware = basicAuth({
  users: { 'admin': '1234' },
  challenge: true,
  realm: 'Imb4T3st4pp'
})

const bodyParserMiddleware = bodyParser.urlencoded({ extended: false })
const data = [
  { longUrl: 'http://google.com', id: randomstring.generate(6)}
]

app.set('view engine', 'ejs')
app.use('/static', express.static('public'))
app.use(morgan('tiny'))

app.get('/', authMiddleware, (req,res)=>{
  res.render('index.ejs', {data});
})

app.post('/', authMiddleware, bodyParserMiddleware, (req, res)=> {
  const longUrl = req.body.longURL
  let id 

  while(true){
    const newid = randomstring.generate(6)
    const chkid = data.find(item=> item.id===newid)
    if(!chkid){
      id = newid
      break
    }
  }

  data.push({longUrl, id})
  res.redirect('/')
  
})

app.get('/:id', (req, res) => {
  const id = req.params.id
  const matched = data.find(item=> item.id === id)
  if(matched){
    res.redirect(301, matched.longUrl)
  } else {
    res.status(404)
    res.send('404 Not Found')
  }

})

app.listen(3000, ()=>{
  console.log('server start...')
})