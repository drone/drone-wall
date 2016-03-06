drone-wall
==========

`drone-wall` is a wall display component for the [Drone CI server](https://github.com/drone/drone)

![alt text](http://tathanen.github.io/drone-wall.jpg "Wall display")

### Deployment

    $ docker pull scottwferg/drone-wall:2.1
    $ docker run -p 3000:8080 -e API_SCHEME=$API_SCHEME -e API_DOMAIN=$API_DOMAIN \
        -e API_TOKEN=$API_TOKEN -e API_PORT=$API_PORT -e WALL_PORT=8080 scottwferg/drone-wall:2.1

Drone wall exposes port `3000`. You can map this to whatever you like.

The `API_` variables are required to configure the route that's hit to find new Drone builds.  
`SCHEME` accepts HTTP or HTTPS, `DOMAIN` is where you provide the domain that is hosting the 
API, `WALL_PORT` sets the port for the api host (default 443 for https and 80 for http), and `TOKEN` is where you should paste the access token that will authenticate you with 
the Drone API (found in your Drone user settings).
