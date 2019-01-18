# react-flask

### App build  
```bash
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt

export FLASK_APP=app
export FLASK_ENV=development 
flask run

# shutdown
deactivate
```

### App startup  
```bash
. venv/bin/activate
FLASK_APP=app FLASK_ENV=development flask run
```

### App shutdown
```bash
deactivate
```

### Client startup  
```bash
cd client
npm install
npm start
```

To view open: http://localhost:3000

### Notes

## Flask
* [ENV Docs](http://flask.pocoo.org/docs/1.0/cli/)

