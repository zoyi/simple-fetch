# simple-fetch
Simple, easy to use fetch wrapping module

## Installation
```
npm install simple-fetch
```

## Testing
```
npm test
```

## Building
```
npm run build
```

## Usage
```
// Require
var sf = require('simple-fetch')

// Create instance
var client = new sf.Client()

// Set base url
client.setBaseUrl({
    staging: 'http://api.dev.example.com',
    production: 'http://api.example.com'
})

// Set default header
client.setDefaultHeader({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
})

// GET (query is default)
const query = { key: 'value' }
client.get('url', query)

// POST, PUT (json encoding is default)
const body = { key: 'value' }
client.post('url', body)
client.put('url', body)

// DELETE
client.destroy('url')
```

## To Do

- Support POST, PUT with form url encoded
- Support POST, PUT with form data
- Support dynamic header
