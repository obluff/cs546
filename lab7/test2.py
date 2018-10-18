import json
import requests
recipeId = '15676d30-d30f-11e8-bbbf-cd376d5a74d3'
with open('patchpasta.json') as f: recipeData= json.load(f)
print(recipeData)
r = requests.put('http://localhost:3000/recipes/'+ recipeId, data=(recipeData))
print(r.text)

