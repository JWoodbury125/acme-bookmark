const { db, Bookmark, Category } = require('./db')
const express = require ('express')
const app = express()

app.get('/', (req, res) => res.redirect('/bookmarks'))
app.get('/bookmarks', async (req, res, next) => {
    try{
        const bookmarks = await Bookmark.findAll({
            include: [ Category ]
        })
        const html = bookmarks.map( bookmark =>{
            return `
                <div> ${bookmark.name}  <a href='/category/${bookmark.categoryId}'>${bookmark.category.name}</a></div>
            `
        }).join('')
        res.send(`
            <html>
                <head> <title> Acme_Bookmarks </title>
                </head>
                <body>
                    <h1> Acme Bookmarks </h1>
                    ${html}
                </body>
            </html>
        `)
    }
    catch(ex){
        next(ex)
    }
})

app.get('/category/:categoryId', async (req, res, next) => {
    try{
        const categories = await Category.findByPk(req.params.categoryId)
        res.send(categories.name)
    }
    catch(ex){
        next(ex)
    }
})

const start = async () =>{
    try{
        await db.sync({ force: true })
        console.log('Starting database sync')
        const search = await Category.create( {name: 'search'})
        const coding = await Category.create( {name: 'coding'})
        const jobs = await Category.create( {name: 'jobs'})
        await Bookmark.create( {name: 'google.com', categoryId: search.id} )
        await Bookmark.create( {name: 'stackoverflow.com', categoryId: coding.id} )
        await Bookmark.create( {name: 'bing.com', categoryId: search.id} )
        await Bookmark.create( {name: 'linkedin.com', categoryId: jobs.id} )
        await Bookmark.create( {name: 'indeed.com', categoryId: jobs.id} )
        await Bookmark.create( {name: 'msdn.com', categoryId: coding.id} )

    }
    catch(ex){
        console.log('Uh Oh..trouble with database insertion', ex)
    }
}

start()

const PORT = 3000;
app.listen(PORT, () => (console.log('Listening on Port', PORT)))