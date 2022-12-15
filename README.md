# Open Music API

Proyek submission kelas [Belajar Fundamental Aplikasi Back-End](https://www.dicoding.com/academies/271) di [Dicoding Indonesia](https://www.dicoding.com).

## Mengonfigurasi Environment

File `.env` (development):

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
```

## Menjalankan di local

```bash
$ git clone https://github.com/satriows25/dicoding-open-music-api.git
$ cd dicoding-open-music-api
$ npm install
$ npm run migrate up
$ npm run start-dev
```

## [Postman Collection dan Environment untuk Open Music API](https://github.com/satriows25/dicoding-open-music-api/tree/main/postman)

- **Collection**: `/postman/Open Music API V2 Test.postman_collection.json`
- **Environment**: `/postman/OpenMusic API Test.postman_environment.json`
