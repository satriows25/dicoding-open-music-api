const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylistId({ playlistId, songId }) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke Playlist');
    }

    return result.rows[0].id;
  }

  async getSongsFromPlaylistId(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists
      INNER JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id
      INNER JOIN songs ON songs.id = playlistsongs.song_id
      WHERE playlists.id = $1`,
      values: [playlistId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal mengambil lagu-lagu dari playlist');
    }

    return result.rows;
  }

  async deleteSongFromPlaylistId(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Lagu gagal dihapus dari playlist. Id tidak ditemukan'
      );
    }
  }
}

module.exports = PlaylistSongsService;
