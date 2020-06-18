const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
var MongoClient = require('mongodb').MongoClient
var net = require('net');
const redisClient = require('redis').createClient;
const redis = redisClient(6379, 'localhost');

var HOST = 'localhost';
var PORT1 = 8001;
var PORT2 = 8002;
var PORT3 = 8003;
var PORT4 = 8004;
var PORT5 = 8005;

app.set('view engine', 'ejs');

const url = 'mongodb+srv://rama:rama@cluster0-mbkt1.mongodb.net/test'

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  if (err) {
    console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
  }
  console.log('DB Connected...');
  db = client.db('smart_plantation');
  app.emit('ready');
});

redis.on("connect", () => {
  console.log('connected to Redis');
});

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname + '/index.html'));
  //res.render(views, locals)

  db.collection('sensor').find().sort([['_id', 1]]).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', { sensor: result })
  })
});

app.get('/sensors/:_id', async (req, res) => {
  // return article from database
  try {
    const sensorData = await getSensor(parseInt(req.params._id));
    res.json({ error: false, message: 'success', data: sensorData });
  }
  catch(e) {
    res.json({ error: true, message: 'Error occurred during processing' });
  }
});

function getSensor(_id) {
  return new Promise((resolve, reject) => {
    redis.get(_id, (err, reply) => {
      if (err) {
        console.log(err);
      } else if (reply) {
        resolve(reply);
      } else {
        db.collection('sensor').find({
          _id: _id
        }).toArray((err, sensorData) => {
          if (err) {
            return reject(err);
          }
          if (sensorData.length > 0) {
            // set in redis
            redis.set(_id, JSON.stringify(sensorData));
            console.log(sensorData);
          }
          resolve(sensorData);
        });
      }
    });
  });
}

app.on('ready', function () {
  net.createServer(function (sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function (data) {

      console.log('DATA 1 ' + sock.remoteAddress + ': ' + data);
      // Write the data back to the socket, the client will receive it as data from the server
      sock.write('You said "' + data + '"');

      var arr = data.toString().split(",");

      db.collection('sensor').save({ _id: parseInt(arr[0]), soil: parseInt(arr[1]), ph: parseInt(arr[2]) }, (err, result) => {
        if (err) return console.log(err)
      })

      // update redis
      db.collection('sensor').find({
        _id: parseInt(arr[0])
      }).toArray((err, sensorData) => {
        if (err) {
          return reject(err);
        }
        if (sensorData.length > 0) {
          // set in redis
          redis.set(parseInt(arr[0]), JSON.stringify(sensorData));
          // console.log(sensorData);
        }
      });


    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
      console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

  }).listen(PORT1, HOST);


  net.createServer(function (sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function (data) {

      console.log('DATA 2 ' + sock.remoteAddress + ': ' + data);
      // Write the data back to the socket, the client will receive it as data from the server
      sock.write('You said "' + data + '"');

      var arr = data.toString().split(",");

      db.collection('sensor').save({ _id: parseInt(arr[0]), soil: parseInt(arr[1]), ph: parseInt(arr[2]) }, (err, result) => {
        if (err) return console.log(err)
      })

      // update redis
      db.collection('sensor').find({
        _id: parseInt(arr[0])
      }).toArray((err, sensorData) => {
        if (err) {
          return reject(err);
        }
        if (sensorData.length > 0) {
          // set in redis
          redis.set(parseInt(arr[0]), JSON.stringify(sensorData));
          // console.log(sensorData);
        }
      });

    });
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
      console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

  }).listen(PORT2, HOST);

  net.createServer(function (sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function (data) {

      console.log('DATA 3 ' + sock.remoteAddress + ': ' + data);
      // Write the data back to the socket, the client will receive it as data from the server
      sock.write('You said "' + data + '"');

      var arr = data.toString().split(",");

      db.collection('sensor').save({ _id: parseInt(arr[0]), soil: parseInt(arr[1]), ph: parseInt(arr[2]) }, (err, result) => {
        if (err) return console.log(err)
      })

      // update redis
      db.collection('sensor').find({
        _id: parseInt(arr[0])
      }).toArray((err, sensorData) => {
        if (err) {
          return reject(err);
        }
        if (sensorData.length > 0) {
          // set in redis
          redis.set(parseInt(arr[0]), JSON.stringify(sensorData));
          //console.log(sensorData);
        }
      });

    });
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
      console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

  }).listen(PORT3, HOST);

  net.createServer(function (sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function (data) {

      console.log('DATA 4 ' + sock.remoteAddress + ': ' + data);
      // Write the data back to the socket, the client will receive it as data from the server
      sock.write('You said "' + data + '"');

      var arr = data.toString().split(",");

      db.collection('sensor').save({ _id: parseInt(arr[0]), soil: parseInt(arr[1]), ph: parseInt(arr[2]) }, (err, result) => {
        if (err) return console.log(err)
      })

      // update redis
      db.collection('sensor').find({
        _id: parseInt(arr[0])
      }).toArray((err, sensorData) => {
        if (err) {
          return reject(err);
        }
        if (sensorData.length > 0) {
          // set in redis
          redis.set(parseInt(arr[0]), JSON.stringify(sensorData));
          // console.log(sensorData);
        }
      });

    });
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
      console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

  }).listen(PORT4, HOST);

  net.createServer(function (sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function (data) {

      console.log('DATA 5 ' + sock.remoteAddress + ': ' + data);
      // Write the data back to the socket, the client will receive it as data from the server
      sock.write('You said "' + data + '"');

      var arr = data.toString().split(",");

      db.collection('sensor').save({ _id: parseInt(arr[0]), soil: parseInt(arr[1]), ph: parseInt(arr[2]) }, (err, result) => {
        if (err) return console.log(err)
      })

      // update redis
      db.collection('sensor').find({
        _id: parseInt(arr[0])
      }).toArray((err, sensorData) => {
        if (err) {
          return reject(err);
        }
        if (sensorData.length > 0) {
          // set in redis
          redis.set(parseInt(arr[0]), JSON.stringify(sensorData));
          // console.log(sensorData);
        }
      });

    });
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
      console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

  }).listen(PORT5, HOST);
});

// app.post('/sensor', (req, res) => {
//   db.collection('sensor').save(req.body, (err, result) => {
//     if (err) return console.log(err)

//     console.log('saved to database')
//     res.redirect('/')
//   })
// })

// function getRandomInt(max) {
//   return Math.floor(Math.random() * Math.floor(max));
// }

// function dummy_sensor_tree() {
// 	db.collection('sensor').insertOne({_id: 1, soil: getRandomInt(100), ph: getRandomInt(100)}, (err, result) => {
//     if (err) return console.log(err)
//   })
// }

// setInterval(dummy_sensor_tree, 5000);

app.listen(port, () => console.log(`listening on port ${port}!`))