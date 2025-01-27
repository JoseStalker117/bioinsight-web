import pyrebase

firebaseConfig = {
    "apiKey": "AIzaSyCzw2DUuvxuSRya3RMOFvI4vpyM9leqiwU",
    "authDomain": "bioinsight23.firebaseapp.com",
    "databaseURL": "https://bioinsight23-default-rtdb.firebaseio.com",
    "projectId": "bioinsight23",
    "storageBucket": "bioinsight23.firebasestorage.app",
    "messagingSenderId": "24544560116",
    "appId": "1:24544560116:web:2c108cb5e57f9f9356afa1"
}

firebase = pyrebase.initialize_app(firebaseConfig)

auth = firebase.auth()
database = firebase.database()
storage = firebase.storage() 