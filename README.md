Drone-wall
==========

`drone-wall` is a wall display component for the [Drone CI server](https://github.com/drone/drone)

![alt text](https://camo.githubusercontent.com/8fe545fe1a31ff6948059cbc55f87997382c4a7b/687474703a2f2f692e696d6775722e636f6d2f517342773756342e706e67 "Wall display")

## Build instructions

From your GOPATH:

        $ go get
        $ go build
        $ ./drone-wall --datasource=/var/lib/drone/drone.sqlite --repos=github.com/scottferg/Fergulator,github.com/scottferg/Dropbox-Go

## Commandline options

`--repos`: Comma-delimited list of repositories. This is generally the Github or Bitbucket path.
`--datasource`: Specifies the location of your `drone.sqlite` file
`--port`: Port to listen on (i.e. `--port=:8080`)

## Notes

Currently `drone-wall` relies on the SQLite database file used by Drone. Because of this it is likely necessary
that you will need to run `drone-wall` on the same server as your Drone server. This will be changed soon once the
Drone API is completed.
