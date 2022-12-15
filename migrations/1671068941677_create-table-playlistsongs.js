exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlistId: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    songId: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  });

  pgm.addConstraint(
    'playlistsongs',
    'unique_playlistId_and_songId',
    'UNIQUE("playlistId", "songId")'
  );

  pgm.addConstraint(
    'playlistsongs',
    'fk_playlistsongs.playlistId_playlists.id',
    'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'playlistsongs',
    'fk_playlistsongs.songId_songs.id',
    'FOREIGN KEY("songId") REFERENCES songs(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('playlistsongs');
};
