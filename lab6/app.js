const express = require('express');

const app = express();

app.get('/about', (req, res) => {
    res.json({
        name: 'Ian Wright',
        cwid: 10407090,
        biography: 'I was born in a jar',
        favoriteShows: ['The News', 'Jeapordy', 'Neon Genesis Evangellion'],
    })
});

app.get('/story', (req, res) => {
    res.json({
      storyTitle: 'the time i kicked a dog',
      story: 'one time i kicked a dog. I am very sorry, for kicking the dog'
    })
});

app.get('/education', (req, res) => {
  res.json([{
    schoolName: 'Stevens Institute Of Technology',
    degree: 'BS business',
    favoriteClass: 'CS559',
    favoriteMemory: 'living it up with all of my friends!!!!!! uwu'
  },
  { schoolName: 'south shore charter school',
    degree: 'Highschool',
    favoriteClass: 'Political and Social Actions Workshop',
    favoriteMemory: 'my first kiss uwu'}
])

})

app.listen(3000, () => console.log('http://localhost:3000'))
