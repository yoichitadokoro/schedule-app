const sqlite3 = require('sqlite3').verbose()
let db
class Sqlite{
  conn () {
    if (!db || !db.open) {
      db = new sqlite3.Database('schedule.db')
    }
    return db
  }
  createBlowtable(){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS BlowMachine (\
              idm INTEGER PRIMARY KEY,\
              fullname TEXT,\
              dispname TEXT,\
              odr INTEGER,\
              jusigata NUMERIC)")
        const datalist = [
              [1, '1GT2号機','2号',1,true],
              [2, '1GT3号機','3号',2,false],
              [3, '1GT4号機','4号',3,true],
              [4, 'PEM','PEM',4,false],
              [5, 'TSD-1L','TSD',5,false],
              [6, 'Sidel Matrix','Sidel',6,false],
        ]
        const machine = db.prepare("REPLACE INTO BlowMachine VALUES (?,?,?,?,?)")
        for(var i=0;i<datalist.length;i++){
          machine.run(datalist[i])
        }
        machine.finalize()
        db.run("PRAGMA foreign_keys=true")
        db.run("CREATE TABLE IF NOT EXISTS BlowSchedule (\
              id INTEGER PRIMARY KEY,\
              blow_machine INTEGER default 1,\
              name TEXT default '名無し',\
              summary TEXT default '空白',\
              PFgeom INTEGER default 0,\
              PFnum INTEGER default 0,\
              start_date DATE CHECK(start_date like '____-__-__'),\
              end_date   DATE CHECK(end_date like '____-__-__'),\
              plamold NUMERIC,\
              plantPF TEXT default '',\
              color TEXT default '#ffff00',\
              created_at DATE,\
              iserr INTEGER default 0,\
              FOREIGN KEY(blow_machine) REFERENCES BlowMachine(idm))")
        db.run("CREATE INDEX IF NOT EXISTS blow_start_end on BlowSchedule (start_date, end_date)")
        resolve()
      })
    })
  }
  createInjtable(){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS InjMachine (\
              idm INTEGER PRIMARY KEY,\
              fullname TEXT,\
              dispname TEXT,\
              odr INTEGER)")
        const datalist = [
              [1, 'NEX110','NEX110',1],
              [2, 'NEX2000','NEX2000',2],
              [3, 'ES3000','ES3000',3],
              [4, 'NEX140','NEX140',4],
              [5, '結晶化HT1','HT1',5],
              [6, '結晶化HT2','HT2',6],
              [7, '二色成形機','二色',7],
        ]
        const machine = db.prepare("REPLACE INTO InjMachine VALUES (?,?,?,?)")
        for(var i=0;i<datalist.length;i++){
          machine.run(datalist[i])
        }
        machine.finalize()
        db.run("PRAGMA foreign_keys=true")
        db.run("CREATE TABLE IF NOT EXISTS InjSchedule (\
              id INTEGER PRIMARY KEY,\
              inj_machine INTEGER default 1,\
              name TEXT default '名無し',\
              summary TEXT default '空白',\
              start_date DATE CHECK(start_date like '____-__-__'),\
              end_date   DATE CHECK(end_date like '____-__-__'),\
              color TEXT default '#ffff00',\
              created_at DATE ,\
              iserr INTEGER default 0,\
              FOREIGN KEY(inj_machine) REFERENCES InjMachine(idm))")
        db.run("CREATE INDEX IF NOT EXISTS inj_start_end on InjSchedule (start_date, end_date)")
        resolve()
      })
    })
  }
  createHolidaytable(){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS Holiday (\
              id INTEGER PRIMARY KEY,\
              day DATE CHECK(day like '____-__-__'))")
        resolve()
      })
    })
  }
  resetTable(){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.serialize(() => {
        db.run('DROP TABLE IF EXISTS BlowMachine')
        db.run('DROP TABLE IF EXISTS BlowSchedule')
        db.run('DROP TABLE IF EXISTS InjMachine')
        db.run('DROP TABLE IF EXISTS InjSchedule')
        db.run('DROP TABLE IF EXISTS Holiday')
        resolve()
      })
    })
  }
  dammydata(){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.serialize(() => {
        const date = new Date()
        const now = date.toString()
        const datalist1 = [
            [1, 1,'tester1','testblow1',1,100,'2020-12-01','2020-12-05',false,'Y','#ffff00',now,0],
            [2, 1,'tester2','testblow2',1,200,'2020-12-20','2020-12-29',false,'Y','#ff0000',now,0],
            [3, 3,'tester3','testblow3',2,500,'2020-12-01','2020-12-05',false,'Y','#00ff00',now,0],
            [4, 4,'tester4','testblow4',1,500,'2020-12-01','2020-12-05',false,'Y','#fffff0',now,0],
            [5, 4,'tester5','testblow4',1,500,'2020-12-01','2020-12-05',false,'Y','#0f0f00',now,0],
            [6, 4,'tester6','testblow4',1,500,'2020-12-06','2020-12-10',false,'Y','#ffff00',now,0],
        ]
        const d1 = db.prepare("REPLACE INTO BlowSchedule VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
        for(var i=0;i<datalist1.length;i++){
          d1.run(datalist1[i])
        }
        d1.finalize()
        const datalist2 = [
            [1, 1,'tester1','testinj1','2020-12-01','2020-12-05','#00ff00',now,0],
            [2, 3,'tester2','testinj2','2020-12-01','2020-12-05','#0000ff',now,0],
            [3, 3,'tester3','testinj3','2020-12-20','2020-12-25','#f0ff00',now,0],
            [4, 1,'tester4','testinj4','2020-12-20','2020-12-25','#00ffff',now,0],
        ]
        const d2 = db.prepare("REPLACE INTO InjSchedule VALUES (?,?,?,?,?,?,?,?,?)")
        for(var i=0;i<datalist2.length;i++){
          d2.run(datalist2[i])
        }
        d2.finalize()
        resolve()
      })
    })
  }
  get_query_blow_machines(){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.all('SELECT * FROM BlowMachine ', (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  get_query_blow_schedule(sdate,fdate){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.all('SELECT * FROM BlowSchedule as a inner join BlowMachine as b on a.blow_machine = b.idm \
              WHERE a.start_date <= ? AND a.end_date >= ? order by b.odr,a.start_date'
              ,fdate,sdate, (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  get_query_blow_schedule2(sdate,fdate,machine){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.all('SELECT * FROM BlowSchedule as a inner join BlowMachine as b on a.blow_machine = b.idm \
              WHERE a.start_date <= ? AND a.end_date >= ? AND a.blow_machine = ? order by b.odr,a.start_date'
              ,fdate,sdate,machine, (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  get_query_inj_machines(){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.all('SELECT * FROM InjMachine ', (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  get_query_inj_schedule(sdate,fdate){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.all('SELECT * FROM InjSchedule as a inner join InjMachine as b on a.inj_machine = b.idm \
              WHERE a.start_date <= ? AND a.end_date >= ? order by b.odr,a.start_date'
              ,fdate,sdate, (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  get_query_inj_schedule2(sdate,fdate,machine){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.all('SELECT * FROM InjSchedule as a inner join InjMachine as b on a.inj_machine = b.idm \
              WHERE a.start_date <= ? AND a.end_date >= ? AND a.inj_machine = ? order by b.odr,a.start_date'
              ,fdate,sdate,machine, (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  get_query_blow_jusigata(){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.all('SELECT * FROM BlowMachine WHERE BlowMachine.jusigata = 1 ORDER BY BlowMachine.odr'
              , (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  get_query_holiday(sdate,fdate){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.all('SELECT * FROM Holiday WHERE ? <= Holiday.day AND Holiday.day <= ?'
              ,sdate,fdate, (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  new_blow_schedule(data){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("INSERT INTO \
            BlowSchedule(blow_machine,name,summary,PFgeom,PFnum,start_date,end_date,plamold,plantPF,color,iserr,created_at) \
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",data, (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  new_inj_schedule(data){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("INSERT INTO \
            InjSchedule(inj_machine,name,summary,start_date,end_date,color,iserr,created_at) \
            VALUES (?,?,?,?,?,?,?,?)",data, (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  update_blow_schedule(data){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("REPLACE INTO \
            BlowSchedule(id,blow_machine,name,summary,PFgeom,PFnum,start_date,end_date,plamold,plantPF,color,iserr,created_at) \
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",data, (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  update_inj_schedule(data){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("REPLACE INTO \
            InjSchedule(id,inj_machine,name,summary,start_date,end_date,color,iserr,created_at) \
            VALUES (?,?,?,?,?,?,?,?,?)",data, (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  delete_blow_schedule(id1){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("DELETE FROM BlowSchedule WHERE id = ?",id1, (err, rows) => {
          if (err) reject(err)
          resolve(rows)
        })
    })
  }
  delete_inj_schedule(id1){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("DELETE FROM InjSchedule WHERE id = ?",id1, (err, rows) => {
          if (err) reject(err)
          resolve(rows || [])
        })
    })
  }
  clean_old(){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      const date = new Date()
      let cnt = 0
      const old = (date.getFullYear()-2) + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2)
      db.serialize(() => {
        db.get("SELECT count(*) FROM BlowSchedule WHERE end_date < ?",old,(err,row)=>{
          if(err) return reject()
          cnt = cnt + parseInt(row["count(*)"])
        })
        db.get("SELECT count(*) FROM InjSchedule WHERE end_date < ?",old,(err,row)=>{
          if(err) return reject()
          cnt = cnt + parseInt(row["count(*)"])
        })
        db.run("DELETE FROM BlowSchedule WHERE end_date < ?",old)
        db.run("DELETE FROM InjSchedule WHERE end_date < ?",old,()=>resolve(cnt))
      })
    })
  }
  update_blow_machine(data){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("REPLACE INTO \
            BlowMachine(idm,fullname,dispname,odr,jusigata) \
            VALUES (?,?,?,?,?)",data, (err, rows) => {
          if (err) reject(err)
          resolve()
      })
    })
  }
  update_inj_machine(data){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("REPLACE INTO \
            InjMachine(idm,fullname,dispname,odr) \
            VALUES (?,?,?,?)",data, (err, rows) => {
          if (err) reject(err)
          resolve()
      })
    })
  }
  delete_blow_machine(id1){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("DELETE FROM BlowMachine WHERE idm = ?",id1, (err, rows) => {
          if (err) reject(err)
          resolve(rows)
        })
    })
  }
  delete_inj_machine(id1){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("DELETE FROM InjMachine WHERE idm = ?",id1, (err, rows) => {
          if (err) reject(err)
          resolve(rows)
        })
    })
  }
  new_blow_machine(data){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("INSERT INTO \
            BlowMachine(fullname,dispname,odr,jusigata) \
            VALUES (?,?,?,?)",data, (err, rows) => {
          if (err) reject(err)
          resolve(rows)
        })
    })
  }
  new_inj_machine(data){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.run("INSERT INTO \
            InjMachine(fullname,dispname,odr) \
            VALUES (?,?,?)",data, (err, rows) => {
          if (err) reject(err)
          resolve(rows)
        })
    })
  }
  new_holidays(daylist){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.serialize(() => {
        const d1 = db.prepare("INSERT INTO Holiday(day) VALUES (?)")
        for(var i=0;i<daylist.length;i++){
          d1.run(daylist[i])
        }
        d1.finalize()
        resolve()
      })
    })
  }
  delete_holidays(daylist){
    return new Promise((resolve, reject) => {
      let db = this.conn()
      db.serialize(() => {
        const d1 = db.prepare("DELETE FROM Holiday WHERE day = ?")
        for(var i=0;i<daylist.length;i++){
          d1.run(daylist[i])
        }
        d1.finalize()
        resolve()
      })
    })
  }
}

module.exports = Sqlite
