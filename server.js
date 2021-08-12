var express =require("express");
var app =express();
app.use(express.static("public")); 
app.set("view engine","ejs");
app.set("views","./views")
var server =require("http").Server(app);
var Rhttp = require('request');
const fs = require('fs');

var admin = require("firebase-admin");
var serviceAccount = require("./aaa.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tluschedule.firebaseio.com"
});
const db = admin.firestore();



//let data = JSON.stringify(student);
//fs.writeFileSync('default.json', data);


server.listen(80);
app.get("/",function (req,res) {
    res.render("trangchu");
})

app.get("/config",function (req,res) {
  let rawdata = fs.readFileSync('default.json');
  var result = removeDefaultJSON(JSON.parse(req.query.data),JSON.parse(rawdata));
  res.send(result);
})

 
function getInforStudent(token){
  var result= undefined;
  Rhttp.get({
    url: 'http://dkhsv.tlu.edu.vn:8099/education/api/student/getstudentbylogin',
    headers: { 
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate',
      'Authorization': 'Bearer ' + token+'',
      'Connection': 'keep-alive',
      'User-Agent': 'Hello TLU'
    },
    method: 'GET'
    },
    function (e, r, body) {
      if(r && r.statusCode == 200){
        result = body;
      } else {
        result = '';
      }
    });
  while(result === undefined) {
    require('deasync').runLoopOnce();
  }
  return result;
}

function getToken(user, pass){
  var result= undefined;
  Rhttp.post({
    url: 'http://dkhsv.tlu.edu.vn:8099/education/oauth/token',
    form: { 
      username: user,
      password: pass, 
      client_secret: 'password',
      grant_type: 'password',
      client_id: 'education_client'
    },
    headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
        'Content-Type' : 'application/x-www-form-urlencoded' 
    },
    method: 'POST'
    },
    function (e, r, body) {
      if(r && r.statusCode == 200){
        result = JSON.parse(body)['access_token'];
      } else result = '';
    });
  while(result === undefined) {
    require('deasync').runLoopOnce();
  }
  return result;
}
app.get("/data",async function (req,res) {

  const citiesRef = db.collection('Subscribers');
  const snapshot = await citiesRef.get();
  var i = 0;
  snapshot.forEach(async doc => {
      i = i +1;
      console.log(i);
     // await insertUser(doc); 
  }); 
  res.send("Done");
})

async function insertUser(doc) {
  var tk = getToken(doc.data()['user'], doc.data()['pass']);
  if (tk != '') {
    var d = getInforStudent(tk);
    if (d != '') {
      d = JSON.parse(d);
      console.log(d["enrollmentClass"]["courseyear"]["name"]); //khoa lop
      console.log(d["enrollmentClass"]["speciality"]["name"]); //khoa lop
      console.log(d["enrollmentClass"]["trainingBase"]["name"]); //cơ sở
      console.log(d["user"]["email"]); //email
      console.log(d["user"]["person"]["phoneNumber"]); //sdt
      console.log(d["user"]["person"]["birthPlace"]); //plane
      console.log("==========");
      var docRef = db.collection('Subscribers').doc(doc.data()['user']);
      await docRef.set({
        password: doc.data()['pass'],
        fullname: d['displayName'],
        birthday: d['birthDateString'],
        class: d["enrollmentClass"]["courseyear"]["name"],
        depart: d["enrollmentClass"]["speciality"]["name"],
        email: d["user"]["email"],
        numberPhone: d["user"]["person"]["phoneNumber"],
        adress: d["user"]["person"]["birthPlace"]
      });
    }
  }
}

