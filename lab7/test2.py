import json
import requests
recipeId = '7998e6f0-d2fe-11e8-a1e3-6bd2f6d2052d'
with open('patchpasta.json') as f: recipeData= json.load(f)
print(recipeData)
r = requests.patch('http://localhost:3000/recipes/'+ recipeId, data=(recipeData))
print(r.text)

