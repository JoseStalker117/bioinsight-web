import pyrebase

firebaseConfig = {
    "apiKey": "your-api-key",
    "authDomain": "your-auth-domain",
    "databaseURL": "your-database-url",
    "projectId": "your-project-id",
    "storageBucket": "your-storage-bucket",
    "messagingSenderId": "your-messaging-sender-id",
    "appId": "your-app-id"
}

firebase = pyrebase.initialize_app(firebaseConfig)

auth = firebase.auth()
database = firebase.database()
storage = firebase.storage() 