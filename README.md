# Open Music API

The Open Music API is the final project for the [Belajar Fundamental Aplikasi Back-End](https://www.dicoding.com/academies/271) class in [Dicoding Indonesia](https://www.dicoding.com/). It is a RESTful API back-end application with several important features, including:

1. Database with PostgreSQL: This application uses PostgreSQL as a database to store song, album, and singer data.

2. Authentication and Authorization with JWT: This application has an authentication and authorization system using JSON Web Token (JWT) to secure access to song, album, and singer data.

3. Message Broker with RabbitMQ: This application uses RabbitMQ as a message broker to process messages related to songs, albums, and singers.

4. Storage: This application provides a feature to store audio files related to songs.

5. Caching with Redis: This application uses Redis as a cache to improve performance by storing frequently accessed song, album, and singer data in the cache.

With these features, the Open Music API application can help users access and play songs online more effectively and securely. Users can easily access and manipulate song, album, and singer data through the available API, as well as getting faster performance through the use of Redis as a cache.

## Configuring the Environment

`.env` file (development):

```
# server configuration
HOST=localhost
PORT=5000

# node-postgres configuration
PGUSER=
PGHOST=localhost
PGPASSWORD=
PGDATABASE=dicoding_open_music_api
PGPORT=5432

# JWT Token
ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=
ACCESS_TOKEN_AGE=1800

# Message broker
RABBITMQ_SERVER=amqp://localhost

# Redis
REDIS_SERVER=localhost
```

## Running Locally

```bash
$ git clone https://github.com/satriows25/dicoding-open-music-api.git
$ cd dicoding-open-music-api
$ npm install
$ npm run migrate up
$ npm run start-dev
```

## [Postman Collection dan Environment untuk Open Music API](https://github.com/satriows25/dicoding-open-music-api/tree/main/postman)

- **Collection**: `/postman/Open Music API V3 Test.postman_collection.json`
- **Environment**: `/postman/OpenMusic API Test.postman_environment.json`
