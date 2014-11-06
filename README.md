drone-wall
==========

`drone-wall` is a wall display component for the [Drone CI server](https://github.com/drone/drone)

![alt text](http://tathanen.github.io/drone-wall.jpg "Wall display")

### Deployment

    $ docker pull scottwferg/drone-wall
    $ docker run -p 3000:3000 -e API_SCHEME=$API_SCHEME -e API_DOMAIN=$API_DOMAIN \
        -e API_TOKEN=$API_TOKEN scottwferg/drone-wall

Drone wall exposes port `3000`. You can map this to whatever you like.

The `API_` variables are required to configure the route that's hit to find new Drone builds.  
`SCHEME` accepts HTTP or HTTPS, `DOMAIN` is where you provide the domain that is hosting the 
API, and `TOKEN` is where you should paste the access token that will authenticate you with 
the Drone API (found in your Drone user settings).
