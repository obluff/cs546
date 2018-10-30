var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

app.use(require('body-parser').urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('index.hbs');
});


function isPalindrome(string){
  var drome = string.replace(/[^\w]|_/g, '');
  drome = drome.toLowerCase();
  return drome === drome.split('').reverse().join('');
}

app.post('/result', (req, res) => {
  const palindrome = req.body['text-to-test'];
  if (typeof palindrome === 'undefined' || (palindrome === '') ){
    return res.status(400).render('error.hbs');
  }
  var result = isPalindrome(palindrome);
  var text;
  var style;
  if(result == true){
    text = palindrome + ' is a palindrome';
    style = 'success';
  } else {
    text = palindrome + ' is not a palindrome';
    style = 'failure';
  }
  res.render('result.hbs', {
    result: text,
    class: style
  })
});

app.listen(3000, function () {
    console.log('express-handlebars server  listening on: 3000');
});
