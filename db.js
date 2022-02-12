const Sequelize = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_bookmarks')

const Bookmark = db.define('bookmark', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})


const Category = db.define('category', {    
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
        notEmpty: true
        }
    }
})



Bookmark.belongsTo(Category)
Category.hasMany(Bookmark)

module.exports = { db, Bookmark, Category }