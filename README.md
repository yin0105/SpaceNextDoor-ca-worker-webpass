
# Conditional access - Worker node [WebPass]

Conditional access worker node for webpass instances.


## Installation

1. Set up the configuration file

```js
const config = {
    providerId: "",
    doors: [],
    server:{
        cors: {
            enabled: true,
            origin: []
        },
        https: {
            enabled: false,
            key: "",
            cert: "",
            port: 443
        },
        http:{
            enabled: true,
            port: 80
        }
    },
    token:{
        fetch: false,
        key: "",
        refresh: 0
    },
    authentication:{
        username: "",
        password: "",
        headers: {}
    },
    master:{
        url: ""
    },
    target: {
        url: ""
    }
}

module.exports = config;
```
(the urls must end in `/`)

Target = The IP of the target instance.

Master = The IP of the gateway.

## Usage
Start the server:

```bash
node server.js
```

