import json
import requests

with open('pasta.json') as f: recipeData= json.load(f)

print(recipeData)

r = requests.post('http://localhost:3000/recipes', data=(recipeData))
print(r.text)

r = requests.get('http://localhost:3000/recipes')
print(r.text)

requests.delete("'http://localhost:3000/recipes/16b0e4d0-d1a9-11e8-ab0a-cf5df06d603d")

gg = requests.get('http://localhost:3000/recipes')
print(gg.text)


print(gg.text == r.text)
