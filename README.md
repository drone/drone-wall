drone-wall
==========

`drone-wall` is a wall display component for the [Drone CI server](https://github.com/drone/drone)

![alt text](http://tathanen.github.io/drone-wall.jpg "Wall display")

### Deployment

    $ docker run -p 3000:3000 -e API_SCHEME=$API_SCHEME -e API_DOMAIN=$API_DOMAIN \
        -e API_TOKEN=$API_TOKEN drone-wall

The `API_` variables are required to configure the route that's hit to find new Drone builds.  `SCHEME` accepts HTTP or HTTPS, `DOMAIN` is where you provide the domain that is hosting the API, and `TOKEN` is where you should paste the token that will authenticate you with the API.
