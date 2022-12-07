exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    year: {
      type: 'SMALLINT',
      notNull: true
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
