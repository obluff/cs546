# homie-planet

by Ian Wright

* 
## Users

Users will be able to adopt a homie which is their virtual pet. Their pets will be displayed on their profile, and the users will have to take care of the pets

```
{
    "username": "obluff",
    "sessionId":"b3988882-627f-4c59-8d5d-54b7a43b030e",
    "hashedPassword":"$2a$08$XdvNkfdNIL8Fq7l8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    "profile":{
        "username": "obluff",
        "name":"Ian Wright",
        "bio":"I like chilling with my homies",
        "homieNames": ['chillestPet1', 'big_homie3', 'sickpet5']
    }
}
```

| Name | Type | Description |
|------|------|-------------|
| username  | string | A globally unique identifier to represent the user |
| sessionId | string | A globally unique identifier to represent the user's current session |
| hashedPassword | string | A bcrypted string that is a hashed version of the user's password |
| profile | User Profile | The user's profile | 

## User Profile (subdocument; not stored in a collection)

This subdocument is used to describe the user's profile.

```
{
    "name":"Ian Wright",
    "hobby":"Arguably hostile takeovers of democracy. Also, consumption of ribs.",
    "_id":"c5d0fd67-7977-4fc5-9088-33d0347c932b",
    "homieNames": ['sickpet5', 'coolpet13', 'bestpetuwu']
}
```

| Name | Type | Description |
|------|------|-------------|
| name | string | The user's name. | 
| hobby | string | A line of text that represents the user's hobby. |
| homieNames | array of homieNames | List of homie names that belong to the user |  


## Homies

The task collection will store all the tasks that are created.


```
[{
    "_id":"5a5c4461-cdc9-4144-84f9-fcb278c5c122",
    "creator": 'obluff',
    "name":"sickpet5",
    "color":"blue",
    "birthDate": 1541449788:
    "status":{
            "hungerLevel": 3,
            "happinessLevel": 8,
              }, 
     }, 
{
    "_id":"5a5c4461-cdc9-4144-84f9-fcb278c5c122",
    "creator": 'notObluff',
    "name":"coolpet4",
    "color":"red",
    "birthDate": 1541431111:
    "status":{
            "hungerLevel": 1,
            "happinessLevel": 1,
              }, 
     }, ...
 ]
```

| Name | Type | Description |
|------|------|-------------|
| name | string | the pets name (unique) |
| creator | string | The username of the person whom created the pet. |
| color | hex code/color name | color of the pet |
| status |  status object | objet that contains the status of the pet |

## Status (subdocument; not stored in a collection)

This subdocument is used to describe the pets status.

```
"status":{
            "petName": 'sickpet5',
            "hungerLevel": 3,
            "happinessLevel": 8,
         }
```


| Name | Type | Description |
|------|------|-------------|
| petName | string | Identifier name of the pet | 
| hungerLevel | float | Hunger value that decreases over time | 
| happinessLevel | float | Happiness value that decreases over time |





