const db = require('sqlite')


const mongo = 'mongodb://localhost/users'
const mongoose = require('mongoose')

mongoose.connect(mongo, { useNewUrlParser: true ,  useUnifiedTopology: true })
const mg = mongoose.connection;
mg.on('error', console.error.bind(console, 'error connection'));

const users = new mongoose.Schema({
  rowid: {type: Number, required: true, unique: true},
  pseudo: {type: String, required: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true}
})
const user = mongoose.model('User', users)



module.exports = {
  get: (userId) => {
    return await user.findOne({rowid: userId})
    //return db.get('SELECT rowid, * FROM users WHERE rowid = ?', userId)
  },

  count: () => {
    return await user.count()
  },

  getAll: (limit, offset) => {
    return await user.find().skip(offset).limit(limit)
    //return db.all('SELECT rowid, * FROM users LIMIT ? OFFSET ?', limit, offset)
  },

  insert: (params) => {

    let nb = await user.count()
    let add_user = new user({
      rowid: nb,
      pseudo: params.pseudo,
      firstname: params.firstname,
      lastname: params.lastname,
      email: params.email,
      password: params.password
    })

    return await add_user.save()

    // return db.run(
    //   'INSERT INTO users (pseudo, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)',
    //   params.pseudo,
    //   params.firstname,
    //   params.lastname,
    //   params.email,
    //   params.password
    // )
  },
  
    

  update: (userId, params) => {
    let update = await user.findOne({rowid: userId})
    
      update.pseudo = params.pseudo
      update.firstname = params.firstname
      update.lastname = params.lastname
      update.email = params.email
      update.password = params.password

    return await update.save()
    
    // const possibleKeys = ['firstname', 'lastname', 'email', 'pseudo', 'password']

    // let dbArgs = []
    // let queryArgs = []
    // for (key in params) {
    //   if (-1 !== possibleKeys.indexOf(key)) {
    //     queryArgs.push(`${key} = ?`)
    //     dbArgs.push(params[key])
    //   }
    // }

    // if (!queryArgs.length) {
    //   let err = new Error('Bad Request')
    //   err.status = 400
    //   return Promise.reject(err)
    // }

    // dbArgs.push(userId)
    // dbArgs.unshift('UPDATE users SET ' + queryArgs.join(', ') + ' WHERE rowid = ?')

    // return db.run.apply(db, dbArgs).then((stmt) => {
    //   if (stmt.changes === 0){
    //     let err = new Error('Not found')
    //     err.status = 404
    //     return Promise.reject(err)
    //   }

    //   return stmt
    // })
  

  },
    
  remove: (userId) => {
    return await user.deleteOne({rowid: userId})
    //return db.run('DELETE FROM users WHERE rowid = ?', userId)
  }

}
