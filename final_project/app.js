var express = require('express');
var exphbs  = require('express-handlebars');
var bcrypt = require('bcrypt');
var db = require('./db');
var foot = '<div style="text-align:center">| <a href="/signup"> sign up </a> | <a href="/"> home </a> | <a href="/logout"> log out </a> | <a href="/createPet"> create a pet </a> | <a href="/findPets"> find pets </a> </div>'
var head = '<div style="text-align:center"> <img src="/public/logo.png" height="50px"> </div> '

const cookie = require("cookie-parser");

var app = express();


app.use(require('body-parser').urlencoded({ extended: false }));
app.use(cookie());
app.use('/public', express.static('public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.get('/', (req, res) => {
  if(!(req.cookies.authorized)){
    res.render('login.hbs', {text: '', footer: foot, header:head});
}
else{
  res.redirect('/user/' + req.cookies.authorized);
}
});

// app.get('/myPets', (req, res) => {
//   if(!(req.cookies.authorized)){
//     res.render('login.hbs', {text:'', footer: foot});
//   }
//   const user = db.getUser(req.cookies.authorized);
//   for(i = 0; i < user.homies.length; i++){
//
// });

app.post('/feedPet/:petName', async (req, res) => {
  var pet = await db.getPet(req.params.petName);
  if(pet.owner !== req.cookies.authorized) throw 'doesnt work';
  await db.satisfyPet(req.params.petName, 'hunger');
  res.redirect('/homie/' + req.params.petName);
});


app.post('/playPet/:petName', async (req, res) => {
  var pet = await db.getPet(req.params.petName);
  if(pet.owner !== req.cookies.authorized) throw 'doesnt work';
  await db.satisfyPet(req.params.petName, 'happiness');
  res.redirect('/homie/' + req.params.petName);
})

app.get('/createPet', (req, res) => {
  if(!(req.cookies.authorized)){
    res.redirect('/signup');
  }
  else{
  res.render('createPet.hbs');
}
})

async function generateHomies(arr, withOwner){
  var html = ''
  for(i = 0; i < arr.length; i++){
    console.log(i);
    console.log(arr);
    const pet = await db.getPet(arr[i])
    console.log(pet);
      var image = '<img src="/public/pets/' + pet.species + pet.color +'.png">'
      html += '<a href=/homie/' + arr[i] + '>' + image + arr[i] + '</a>';
      if(withOwner === true) html += '<a href=/user/' + pet.owner + '>' +  pet.owner +'</a>';

  }
  return html;
}

app.get('/homie/:petName', async (req, res) =>{
  if(!req.params.petName) res.redirect('/');
  var pet = await db.getPet(req.params.petName);
  var ownerLink = '<a href="/user/' + pet.owner + '">' + pet.owner + '</a>'

  console.log('word')
  console.log(pet.status);
  var handleb = {name: pet.petName, color: pet.color, hunger: pet.status.hunger, happy: pet.status.happiness, owner: ownerLink, type: pet.species, footer: foot, header:head}
  if(pet.owner === req.cookies.authorized){
    console.log('word');
    handleb.feed = '<form class="chill" id="feed" action="/feedPet/' + req.params.petName +'"' +  ' method=post> <button> feed </button> </form>'
    handleb.play = '<form class="chill" id="play" action="/playPet/' + req.params.petName + '"' + ' method=post> <button> play </button> </form>'
  }
  console.log(handleb);

  res.render('homieProfile.hbs', handleb);
});

app.get('/user/:userName', async (req, res) =>{
  if(!req.params.userName) res.redirect('/');
  var data = await db.getUser(req.params.userName);
  var homieHTML = await generateHomies(data.homies, false);
  res.render('private.hbs', {username: data.username, name: data.name, bio: data.bio, homies: homieHTML, footer: foot, header:head});
});

app.post('/login', async (req, res) => {
  const request = await req.body;
  console.log(request);
  var completed = false;

  if(db.userExists(request.username)){
    const user = await db.getUser(request.username);
    if(await bcrypt.compare(request.password, user.password)){
      res.cookie('authorized', request.username);
      res.redirect('/private');
      completed = true;
    }
  }
  if(completed == false) res.render('login.hbs', {text: 'you failed to provide correct credentials', footer: foot, header:head});
});

app.post('/createPet', async (req, res) => {
    const newPet = await req.body;
    console.log(newPet);
    var successful = true;
    if(!(newPet.petName && newPet.color)) res.render('createPet.hbs', {text: 'you failed to provide proper info', footer: foot, header:head});

    const sdf = await db.createPet(newPet, req.cookies.authorized);
    res.redirect('/homie/' + newPet.petName);
})
app.get('/signup', async(req, res) => {
  res.render('signup.hbs', {footer: foot, header:head});
})

app.post('/signup', async (req, res) => {
  const user = await req.body;
  console.log(user);
  var successful = true;
  if(!(user.username && user.password)) res.render('login.hbs', {text: 'you failed to provide proper info', footer: foot, header:head});
  user.username = user.username.replace(/[^A-Z0-9]/ig, "_").replace(' ', '_');
  user.password = await bcrypt.hashSync(user.password, 10);
  try{
    await db.createUser(user);
  } catch(err){
    res.render('signup.hbs', {text: err, footer: foot, header:head})
  }

  res.render('login.hbs', {text: 'user ' + user.username + ' has been created log in now' , footer: foot,header:head});

});

app.get('/logout', (req, res) => {
  res.clearCookie('authorized');
  res.render('login.hbs', {text: 'you have successfully logged out', footer: foot});
});

app.get('/private', async (req, res) => {
  if(!(req.cookies.authorized)){
    res.status(403).send('You gotta log in buddy');
    res.redirect('/');
  }
  if(!db.userExists(req.cookies.authorized)) res.redirect('/', {text: 'some sort of error occured', footer: footer})
  var data = await db.getUser(req.cookies.authorized);
  console.log(data);
  res.render('private.hbs', {username: data.username, name: data.name, bio: data.bio, homies: data.homies, footer: foot});
});

app.get('/findPets', async (req, res) => {
  petObjs = await db.getAllPets();
  var petArray = [];
  for(i = 0; i < petObjs.length; i++){
    if(petObjs[i].owner === req.cookies.authorized){ continue;}
    petArray.push(petObjs[i].petName)
  }
  //randomly sorts the pets array
  petArray.sort( () => Math.random() -0.5 );

  var response = await generateHomies(petArray.slice(0,3), false);

  res.render('allPets.hbs', {homies: response, footer:foot, header:head});
});

app.get('/update/:secret', async (req, res) => {
  if(req.params.secret == 'welovehomies'){

    await db.decreaseStats();
    res.send('done');
  }
});



app.listen(3000, function () {
    console.log('express-handlebars server  listening on: 3000');
    if (process && process.send) process.send({done: true});
});
