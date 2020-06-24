const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const multipart = require('connect-multiparty')
const webpack = require('webpack')
const path = require('path')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(WebpackConfig)

const router = express.Router()

require('./server2')

app.use(express.static(__dirname, {
  setHeaders(res) {
    res.cookie('XSRF-TOKEN-D', '1234abc')
  }
}))
app.use(multipart({
  uploadDir: path.resolve(__dirname, 'upload-file')
}))

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

router.get('/simple/get', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/base/get', function (req, res) {
  res.json(req.query)
})

router.post('/base/post', function (req, res) {
  res.json(req.body)
})

router.post('/base/buffer', function (req, res) {
  let msg = []
  req.on('data', (chunk) => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

router.get('/error/get', function (req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', function (req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    })
  }, 3000)
})

router.post('/extend/post', function (req, res) {
  res.json(req.body)
})
router.get('/extend/get', function (req, res) {
  res.json({
    msg: `hello world get`
  })
})
router.options('/extend/options', function (req, res) {
  res.json({
    msg: `hello world options`
  })
})
router.delete('/extend/delete', function (req, res) {
  res.json({
    msg: `hello world delete`
  })
})
router.head('/extend/head', function (req, res) {
  res.json({
    msg: `hello world head`
  })
})
router.put('/extend/put', function (req, res) {
  res.json({
    msg: `hello world put`
  })
})
router.patch('/extend/patch', function (req, res) {
  res.json({
    msg: `hello world patch`
  })
})

router.get("/interceptor/get", function (req, res) {
  res.json({
    msg: 'hello'
  })
})

router.post('/config/post', function (req, res) {
  res.json({
    data: req.body
  })
})

router.get('/cancel/get', function (req, res) {
  setTimeout(() => {
    res.json({
      data: 'hello~'
    })
  }, 400)
})

router.post('/cancel/post', function (req, res) {
  setTimeout(() => {
    res.json({
      data: 'hello~2'
    })
  }, 400)
})

router.get('/more/get', function (req, res) {
  res.json(req.cookies)
})

router.post('/more/upload', function (req, res) {
  console.log(req.body, req.files)
  res.end('upload success!')
})

app.use(router)

const port = process.env.PORT || 8090
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})