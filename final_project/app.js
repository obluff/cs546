var express = require('express');
var exphbs  = require('express-handlebars');
var bcrypt = require('bcrypt');
var db = require('./db');
var foot = '<div style="footer"> | <a href="signup"> sign up </a> | <a href="/"> home </a> | <a href="/logout"> log out </a> </div> | <a href="createPet"> create a pet </a>'
const cookie = require("cookie-parser");


var app = express();


app.use(require('body-parser').urlencoded({ extended: false }));
app.use(cookie());
app.use('/public', express.static('public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.get('/', (req, res) => {
  if(!(req.cookies.authorized)){
    res.render('login.hbs', {text: '', footer: foot});
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

app.get('/feedPet/:petName', async (req, res) => {
  var pet = await db.getPet(req.params.petName);
  if(pet.owner !== req.cookies.authorized) throw 'doesnt work';
  await db.satisfyPet(req.params.petName, 'hunger');

});


app.get('/playPet/:petName', async (req, res) => {
  var pet = await db.getPet(req.params.petName);
  if(pet.owner !== req.cookies.authorized) throw 'doesnt work';
  await db.satisfyPet(req.params.petName, 'play');
})

app.get('/createPet', (req, res) => {
  if(!(req.cookies.authorized)){
    res.redirect('/signup');
  }
  else{
  res.render('createPet.hbs');
}
})

function generateArray(arr){
  var html = '<ul>'
  for(i = 0; i < arr.length; i++){
    html += '<li><a href=/homie/' + arr[i] + '>' + arr[i] + '</a></li>';
  }
  html += '</ul>'
  return html;
}

app.get('/homie/:petName', async (req, res) =>{
  if(!req.params.petName) res.redirect('/');
  console.log(req.params.petName);
  var pet = await db.getPet(req.params.petName);
  var ownerLink = '<a href="/user/' + pet.owner + '">' + pet.owner + '</a>'
  res.render('homieProfile.hbs', {petName: pet.status.name, hunger: pet.status.hunger, happiness: pet.status.happiness, owner: ownerLink, footer: foot});
});

app.get('/user/:userName', async (req, res) =>{
  if(!req.params.userName) res.redirect('/');
  var data = await db.getUser(req.params.userName);
  var homieHTML = generateArray(data.homies);
  res.render('private.hbs', {username: data.username, name: data.name, bio: data.bio, homies: homieHTML, footer: foot});
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
  if(completed == false) res.render('login.hbs', {text: 'you failed to provide correct credentials', footer: foot});
});

app.post('/createPet', async (req, res) => {
    const newPet = await req.body;
    console.log(newPet);
    var successful = true;
    if(!(newPet.petName && newPet.color)) res.render('createPet.hbs', {text: 'you failed to provide proper info', footer: foot});

    const sdf = await db.createPet(newPet, req.cookies.authorized);
    res.render('createPet.hbs', {text: JSON.stringify(sdf), footer: foot});
})
app.get('/signup', async(req, res) => {
  res.render('signup.hbs', {footer: foot});
})

app.post('/signup', async (req, res) => {
  const user = await req.body;
  console.log(user);
  var successful = true;
  if(!(user.username && user.password)) res.render('login.hbs', {text: 'you failed to provide proper info', footer: foot});

  user.password = await bcrypt.hashSync(user.password, 10);
  try{
    await db.createUser(user);
  } catch(err){
    res.render('signup.hbs', {text: err, footer: foot})
  }
  res.render('login.hbs', {text: 'signup successful, now log into your account', footer: foot});

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

app.get('/allPets', async (req, res) => {
  gg = await db.getAllPets();
  res.send(gg);
});

app.get('/update/:secret', async (req, res) => {
  if(req.params.secret == 'weouthere'){

    await db.decreaseStats();
    res.send('done');
  }
});



app.listen(3000, function () {
    console.log('express-handlebars server  listening on: 3000');
    if (process && process.send) process.send({done: true});
});
