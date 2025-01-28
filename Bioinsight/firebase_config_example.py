import pyrebase

firebaseConfig = {
    "apiKey": "<YOUR-API-KEY>",
    "authDomain": "<YOUR-PROJECT-ID>",
    "databaseURL": "<YOUR-DATABASE-URL>",
    "projectId": "<YOUR-PROJECT-ID>",
    "storageBucket": "<YOUR-PROJECT-ID>",
    "messagingSenderId": "<YOUR-MESSAGING-SENDER-ID>",
    "appId": "<YOUR-APP-ID>"
}

firebase = pyrebase.initialize_app(firebaseConfig)

auth = firebase.auth()
database = firebase.database()
storage = firebase.storage()