const sql = require('mssql')
const config = {
    user: 'jp',
    password: 'Xr29StLb8',
    server: '172.20.69.4', // You can use 'localhost\\instance' to connect to named instance
    database: 'Referentiels',
    driver: 'tedious',
    options: {
        encrypt: true // Use this if you're on Windows Azure
      
    }
}
let toto = {}

sql.connect(config).then(() => {
    return sql.query`select * from dbo.contacts`
}).then(result => {
    toto = result.recordset
    console.log(result.recordset)
    sql.close()
}).then(
    
).catch(err => {
     console.dir("error "+ err)
})

sql.on('error', err => {
    // ... error handler
     console.dir(err)
})
