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

### Encode query string on GET method
```
const query = { key: 'value' }
client.get('url', query)
```

### Encode request body to json on POST, PUT method
```
const body = { key: 'value' }
client.post('url', body)
client.put('url', body)
```

### No encode on DELETE method
```
client.delete('url')
```

### Decode response body to json
```
client.get('url').then((body: JSON) => {
    console.log(body)
})
```

### Reject if status code is not 2XX
```
client.get('url').then(() => {}).catch((err: Error) => {
    console.error(err)
})

// Error type is below.
interface Error {
    status: string;     // status code
    statusText: string; // status text
    body: JSON;         // json decoded response body
}
```

## To Do

- Support various parameter encoding (form, url-encoded)
- Abstract file upload and Support uploading progress
- Support dynamic header (or custom header)
