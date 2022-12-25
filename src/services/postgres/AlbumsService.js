const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year]
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    try {
      const result = await this._cacheService.get(`albums:${id}`);

      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT id, name, year, cover_url AS "coverUrl" FROM albums WHERE id = $1',
        values: [id]
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('Album tidak ditemukan');
      }

      await this._cacheService.set(
        `albums:${id}`,
        JSON.stringify(result.rows[0])
      );

      return result.rows[0];
    }
  }

  async editAlbumById(id, { name, year, coverUrl }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, cover_url = $3 WHERE id = $4 RETURNING id',
      values: [name, year, coverUrl, id]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }

    await this._cacheService.delete(`albums:${id}`);
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }

    await this._cacheService.delete(`albums:${id}`);
  }

  async postAlbumLikeById(userId, albumId) {
    const id = `albumlike-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError(
        'Album gagal diubah statusnya. Id tidak ditemukan'
      );
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async deleteAlbumLikeById(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Album gagal diubah statusnya. Id tidak ditemukan'
      );
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async getAlbumLikeByUserId(userId, albumId) {
    const query = {
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    };

    const result = await this._pool.query(query);

    return result.rows[0].count;
  }

  async getAlbumLikeCountById(id) {
    try {
      const result = await this._cacheService.get(`album-likes:${id}`);

      return {
        likeCount: JSON.parse(result),
        isCache: 1
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [id]
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(
        `album-likes:${id}`,
        JSON.stringify(result.rows[0].count)
      );

      return {
        likeCount: result.rows[0].count
      };
    }
  }
}

module.exports = AlbumsService;
