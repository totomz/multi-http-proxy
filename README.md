# multi-http-proxy
A simple multi-proxy server: each HTTP message recived from a SENDER is proxied to N reciver
```
                             --reciver A
                           /
SENDER ---> multi-http-proxy --  reciver B
                            \ -- reciver C
```
This script can be executed manually, or can be run "à-la-daemon" using [forever](https://www.npmjs.com/package/forever)

# How to install
1. Install node.js :)
2. Clone this project in a folder
3. Install dependencies
```bashp
npm install winston
npm install forever 
```

## How to configure
Simply edit proxy.js - no configuration file

# How to run
```bashp
node proxy.js
```
or
```bashp
forever start proxy.js
```

