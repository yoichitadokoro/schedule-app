const Datastore = require('nedb')
let db = {}

class Nedb{
  conn () {
    if (!db || !db.open) {
      db.test = new Datastore({
        filename:'db/test.json'
      })
    }
    return db
  }
  inserttest(){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.test.loadDatabase(function(err){
        if(err) reject(err)
        const datalist = [
            [1, '1GT2号機','2号',1,true],
            [2, '1GT3号機','3号',2,false],
            [3, '1GT4号機','4号',3,true],
            [4, 'PEM','PEM',4,false],
            [5, 'TSD-1L','TSD',5,false],
            [6, 'Sidel Matrix','Sidel',6,false],
        ]
        var doc = { hello: 'world'
               , n: 5
               , today: new Date()
               , nedbIsAwesome: true
               , notthere: null
               , notToBeSaved: undefined  // Will not be saved
               , fruits: [ 'apple', 'orange', 'pear' ]
               , infos: { name: 'nedb' }
               };
        db.test.insert(doc,(err,newdoc)=>{
          resolve(newdoc)
        })
      })
    })
  }
}
module.exports = Nedb
