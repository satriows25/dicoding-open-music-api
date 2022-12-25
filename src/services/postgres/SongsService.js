const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId]
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    await this._cacheService.delete(`songs:all-song`);

    return result.rows[0].id;
  }

  async getSongs() {
    try {
      const result = await this._cacheService.get(`songs:all-song`);

      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT id, title, performer FROM songs'
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(
        `songs:all-song`,
        JSON.stringify(result.rows)
      );

      return result.rows;
    }
  }

  async getSongById(id) {
    try {
      const result = await this._cacheService.get(`songs:${id}`);

      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT * FROM songs WHERE id = $1',
        values: [id]
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('Lagu tidak ditemukan');
      }

      await this._cacheService.set(
        `songs:${id}`,
        JSON.stringify(result.rows[0])
      );

      return result.rows[0];
    }
  }

  async getSongByAlbumId(id) {
    try {
      const result = await this._cacheService.get(`songs-album:${id}`);

      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
        values: [id]
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(
        `songs-album:${id}`,
        JSON.stringify(result.rows)
      );

      return result.rows;
    }
  }

  async editSongById(id, { title, year, performer, genre, duration }) {
    await this.getSongById(id);

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal memperbarui lagu. Id tidak ditemukan');
    }

    await this._cacheService.delete(`songs:${id}`);
    await this._cacheService.delete(`songs:all-song`);
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }

    await this._cacheService.delete(`songs:${id}`);
    await this._cacheService.delete(`songs:all-song`);
  }
}

module.exports = SongsService;
