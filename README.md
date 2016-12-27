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
```

## Features

### Set base url depending on NODE_ENV
```
// Set base url
client.setBaseUrl('http://base.url')

// Set base url depending on NODE_ENV
client.setBaseUrl({
    staging: 'http://dev.base.url',  // if NODE_ENV is 'staging'
    production: 'http://base.url'    // if NODE_ENV is 'production'
})
```

### Set default header which is applied to every request
```
client.setDefaultHeader({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
})
```

### REST methods (to be continued...)
```
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
