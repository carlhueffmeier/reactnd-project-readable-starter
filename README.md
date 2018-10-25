# Readable

A simple reddit clone.

<img src="https://user-images.githubusercontent.com/27681148/47529819-32e8f280-d8a9-11e8-81b0-4194979180c3.png" alt="demo-screen">

# What is this?

The completion of this project was part of the Udacity React Nanodegree. But I went ahead and made it my own ✌️

In addition to the given requirements, I modified the server and implemented local & OAuth Google authentication via [passport](https://github.com/jaredhanson/passport). Another feature that was challenging to implement was adding per-user up/downvoting.

# Things I learned

During this project, I learned how to...

- ...do client-side state management (using Redux)
- ...normalize state
- ...use a form validation library
- ...build a server in Express
- ...do authentication
- ...use OAuth
- ...build my first fullstack application 🎉

# Getting Started

1. Clone the repository

```sh
> git clone https://github.com/carlhueffmeier/readable.git
```

2. Install dependencies

```sh
> npm install
```

3. Configure your environment

```sh
> cp client-desktop/.env.example client-desktop/.env

> cp server/.env.example server/.env
# Edit server/.env
```

4. Run the project

```sh
# Runs both client and server
> npm start

# Starts the desktop client
> npm run start:client

# Starts the server
> npm run start:server
```

## API Server

More Information about the API server and how to use it can be found in its
[README file](api-server/README.md).
