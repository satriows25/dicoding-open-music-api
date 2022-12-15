exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    year: {
      type: 'SMALLINT',
      notNull: true
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    genre: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    duration: {
      type: 'INT'
    },
    album_id: {
      type: 'VARCHAR(16)'
    }
  });

  pgm.addConstraint(
    'songs',
    'fk_songs.album_id_albums.id',
    'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
