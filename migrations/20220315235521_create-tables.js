
exports.up = function(knex) {
  return knex.schema.createTable('whitelist', tbl => {
    tbl.increments()
    tbl.text('name', 128)
      .notNullable()
  })
  .createTable('description', tbl => {
    tbl.increments()
    tbl.text('text')
      .notNullable()
  })
  .createTable('counter', tbl => {
    tbl.increments()
    tbl.integer('total')
      .notNullable()
    tbl.integer('mage')
      .notNullable()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('whitelist').dropTableIfExists('description').dropTableIfExists('counter')
};
