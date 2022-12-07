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
    albumId: {
      type: 'VARCHAR(16)'
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
