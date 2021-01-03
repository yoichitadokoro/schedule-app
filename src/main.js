// Modules to control application life and create native browser window
const {electron,BrowserWindow,app,ipcMain,Menu} = require('electron');
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + '/preload.js'
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./src/web/main.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const Sqlite = require('./sqlite.js')
const sq = new Sqlite()
const listdays = 37
const fpdf = "schedule_print.pdf"
let datenav = new Date()
let today = new Date()
let tabs = 0
let q_blow = []
let m_blow = []
let q_inj = []
let m_inj = []
let jusigata = []
let holiday = []
let e_blow = null
let e_inj = null
let n_sche = {date:date_to_str(today),machine:1}
let bcal = []
ipcMain.handle("DateNavi", async (event, arg) => {
  const context = {
    'today':date_to_str(today),
    'current':date_to_str(datenav),
    'prev':date_to_str(new Date(datenav.getFullYear(),datenav.getMonth()-1,datenav.getDate())),
    'next':date_to_str(new Date(datenav.getFullYear(),datenav.getMonth()+1,datenav.getDate())),
    'year':datenav.getFullYear(),
    'month':datenav.getMonth()+1,
    'tabs':tabs,
  }
  return context
});
ipcMain.handle("PostDateNavi", async (event, arg) => {
  if(arg.date!=""){
    const date = str_to_date(arg.date)
    datenav = date
  }else{
    datenav = today
  }
  tabs = arg.tabs
  return datenav
});
ipcMain.handle("GetTabState", async (event, arg) => {
  return tabs
});
ipcMain.handle("BlowScheduleList", async (event, arg) => {
  m_blow = await sq.get_query_blow_machines()
  q_blow = await sq.get_query_blow_schedule(date_to_str(sdate()),date_to_str(fdate()))
  let blist = []
  for(var i=0;i<m_blow.length;i++){
    const li = q_blow.filter((v) => v.blow_machine === m_blow[i].idm)
    if(li.length>0){
      for(var j=0;j<li.length;j++){
        let aclass = ""
        const iserr = li.filter((v)=>(li[j].start_date <= v.end_date && v.start_date <= li[j].end_date))
        if(iserr.length>1) aclass="text-danger"
        const datalist = {
          machine: m_blow[i].dispname,
          number:''+(j+1),
          name: li[j].name ,
          summary:li[j].summary,
          PFgeom: li[j].PFgeom,
          PFnum:li[j].PFnum,
          start_date:li[j].start_date.split('-')[1] + '/' + li[j].start_date.split('-')[2],
          end_date:li[j].end_date.split('-')[1] + '/' + li[j].end_date.split('-')[2],
          plamold:maru(li[j].plamold),
          plantPF:li[j].plantPF,
          rows:li.length,
          id:li[j].id,
          color:li[j].color,
          aclass:aclass,
          machineid:m_blow[i].idm,
        }
        blist.push(datalist)
      }
    }else{
      const zerodata = {
        machine: m_blow[i].dispname,
        number:'',
        name: ' ',
        summary:' ',
        PFgeom:' ',
        PFnum:' ',
        start_date:' ',
        end_date:' ',
        plamold:' ',
        plantPF:' ',
        rows:'1',
        id:'0',
        color:'',
        aclass:'',
        machineid:m_blow[i].idm,
      }
      blist.push(zerodata)
    }
  }
  return blist
});
ipcMain.handle("InjScheduleList", async (event, arg) => {
  m_inj = await sq.get_query_inj_machines()
  q_inj = await sq.get_query_inj_schedule(date_to_str(sdate()),date_to_str(fdate()))
  let blist = []
  for(var i=0;i<m_inj.length;i++){
    const li = q_inj.filter((v) => v.inj_machine === m_inj[i].idm)
    if(li.length>0){
      for(var j=0;j<li.length;j++){
        let aclass = ""
        const iserr = li.filter((v)=>(li[j].start_date <= v.end_date && v.start_date <= li[j].end_date))
        if(iserr.length>1) aclass="text-danger"
        const datalist = {
          machine: m_inj[i].dispname,
          number:''+(j+1),
          name: li[j].name ,
          summary:li[j].summary,
          start_date:li[j].start_date.split('-')[1] + '/' + li[j].start_date.split('-')[2],
          end_date:li[j].end_date.split('-')[1] + '/' + li[j].end_date.split('-')[2],
          rows:li.length,
          id:li[j].id,
          color:li[j].color,
          aclass:aclass,
          machineid:m_inj[i].idm,
        }
        blist.push(datalist)
      }
    }else{
      const zerodata = {
        machine: m_inj[i].dispname,
        number:'',
        name: ' ',
        summary:' ',
        start_date:' ',
        end_date:' ',
        rows:'1',
        id:'0',
        color:'',
        aclass:'',
        machineid:m_inj[i].idm,
      }
      blist.push(zerodata)
    }
  }
  return blist
});
ipcMain.handle("BlowInjCalendar", async (event, arg) => {
  m_blow = await sq.get_query_blow_machines()
  q_blow = await sq.get_query_blow_schedule(date_to_str(sdate()),date_to_str(fdate()))
  jusigata = await sq.get_query_blow_jusigata()
  m_inj = await sq.get_query_inj_machines()
  q_inj = await sq.get_query_inj_schedule(date_to_str(sdate()),date_to_str(fdate()))
  holiday = await sq.get_query_holiday(date_to_str(sdate()),date_to_str(fdate()))
  bcal = []
  let date = sdate()
  for(var i=0;i<listdays;i++){
    date.setDate(date.getDate()+1)
    const dlist = {
      day:date.getDate(),
      weekday:weekday(date),
      date:date_to_str(date),
      i:i,
      listforblow:listforblow(date,q_blow,m_blow),
      listforinj:listforinj(date,q_inj,m_inj),
      listforjusigata:listforjusigata(date,q_blow,jusigata),
      holcolor:holcolor(date),
    }
    bcal.push(dlist)
  }
  return bcal
});
ipcMain.handle("GetBlowJusigata", async (event, arg) => {
  jusigata = await sq.get_query_blow_jusigata()
  return jusigata
});
ipcMain.handle("GetBlowMachine", async (event, arg) => {
  m_blow = await sq.get_query_blow_machines()
  return m_blow
});
ipcMain.handle("GetInjMachine", async (event, arg) => {
  m_inj = await sq.get_query_inj_machines()
  return m_inj
});

ipcMain.handle("getTodayVue", async (event, arg) => {
  return date_to_str(today)
});

ipcMain.handle("CheckNewBlow", async (event, arg) => {
  let q = await sq.get_query_blow_schedule2(arg.sdate,arg.fdate,arg.machine)
  return q
});
ipcMain.handle("NewBlowSchedule", async (event, arg) => {
  await sq.new_blow_schedule(arg)
  return 1
});
ipcMain.handle("PostEditBlowSchedule", async (event, arg) => {
  e_blow = arg.id1
  return 1
});
ipcMain.handle("GetEditBlowSchedule", async (event, arg) => {
  const qq = q_blow.find((v)=>(v.id === e_blow))
  return qq
});
ipcMain.handle("CheckEditBlowSchedule", async (event, arg) => {
  const q = await sq.get_query_blow_schedule2(arg.sdate,arg.fdate,arg.machine)
  const qq = q.filter((v)=> v.id !== arg.id1)
  return qq
});
ipcMain.handle("SetEditBlowSchedule", async (event, arg) => {
  await sq.update_blow_schedule(arg)
  return 1
});
ipcMain.handle("DeleteBlowSchedule", async (event, arg) => {
  await sq.delete_blow_schedule(arg)
  return 1
});

ipcMain.handle("CheckNewInj", async (event, arg) => {
  const q = await sq.get_query_inj_schedule2(arg.sdate,arg.fdate,arg.machine)
  return q
});
ipcMain.handle("NewInjSchedule", async (event, arg) => {
  await sq.new_inj_schedule(arg)
  return 1
});
ipcMain.handle("PostEditInjSchedule", async (event, arg) => {
  e_inj = arg.id1
  return 1
});
ipcMain.handle("GetEditInjSchedule", async (event, arg) => {
  const qq = q_inj.find((v)=>(v.id === e_inj))
  return qq
});
ipcMain.handle("CheckEditInjSchedule", async (event, arg) => {
  let q = await sq.get_query_inj_schedule2(arg.sdate,arg.fdate,arg.machine)
  const qq = q.filter((v)=> v.id !== arg.id1)
  return qq
});
ipcMain.handle("SetEditInjSchedule", async (event, arg) => {
  await sq.update_inj_schedule(arg)
  return 1
});
ipcMain.handle("DeleteInjSchedule", async (event, arg) => {
  await sq.delete_inj_schedule(arg)
  return 1
});

ipcMain.handle("GetPDF", async (event, arg) => {
  const PDF = require('./getpdf.js')
  const p = new PDF()
  ishol = isHoliday(today)
  const t = await p.create("src/web/"+fpdf,datenav,bcal,m_blow,m_inj,jusigata,ishol)
  return fpdf
});
ipcMain.handle("CleanDatabase", async (event, arg) => {
  const old = await sq.clean_old()
  return old
});
ipcMain.handle("SetEditBlowMachine", async (event, arg) => {
  await sq.update_blow_machine(arg)
  return 1
});
ipcMain.handle("DeleteBlowMachine", async (event, arg) => {
  await sq.delete_blow_machine(arg)
  return 1
});
ipcMain.handle("NewBlowMachine", async (event, arg) => {
  await sq.new_blow_machine(arg)
  return 1
});
ipcMain.handle("SetEditInjMachine", async (event, arg) => {
  await sq.update_inj_machine(arg)
  return 1
});
ipcMain.handle("DeleteInjMachine", async (event, arg) => {
  await sq.delete_inj_machine(arg)
  return 1
});
ipcMain.handle("NewInjMachine", async (event, arg) => {
  await sq.new_inj_machine(arg)
  return 1
});
ipcMain.handle("HolidayList", async (event, arg) => {
  const sdate = arg + "-01-01"
  const fdate = arg + "-12-31"
  const query = await sq.get_query_holiday(sdate,fdate)
  let hol = []
  for(var i=0;i<query.length;i++){
    hol.push(query[i].day)
  }
  return hol
});
ipcMain.handle("SetHoliday", async (event, arg) => {
  await sq.new_holidays(arg)
  return 1
});
ipcMain.handle("DeleteHoliday", async (event, arg) => {
  await sq.delete_holidays(arg)
  return 1
});
ipcMain.handle("ResetDB", async (event, arg) => {
  await inittable()
});
ipcMain.handle("PostNewSchedule", async (event,arg)=>{
  n_sche.date = arg.date
  n_sche.machine = arg.machine
})
ipcMain.handle("getInitialVue",async (event,arg) => {
  const inivue = Object.assign({},n_sche)
  n_sche.date = date_to_str(today)
  n_sche.machine = 1
  return inivue
});

function date_to_str(date){
  return date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2)
}
function str_to_date(str){
  const spt = str.split("-")
  const fmt = new Date(spt[0],parseInt(spt[1]-1),spt[2])
  return fmt
}
function sdate(){
  const date = new Date(datenav.getFullYear(),datenav.getMonth(),-4)
  return date
}
function fdate(){
  const date = new Date(datenav.getFullYear(),datenav.getMonth(),listdays-1)
  return date
}
function maru(f){
  if(f) return "○"
  else return ""
}
function weekday(date){
  const wk = ["日","月","火","水","木","金","土"]
  return wk[date.getDay()]
}
function isHoliday(date){
  let hol = []
  hol = holiday.filter((v) => v.day === date_to_str(date))
  if(hol.length>0 || date.getDay()==0 || date.getDay()==6) return true
  else return false
}
function holcolor(date){
  if(date_to_str(date) == date_to_str(today)) return "lightgreen"
  else if(isHoliday(date)) return "lightgray"
  else return ""
}
function listforblow(date,query,machine){
  let qlist = []
  qq = query.filter(function(val){
    return (str_to_date(val.start_date) <= date && str_to_date(val.end_date) >= date)
  })
  for(var i=0;i<machine.length;i++){
    let c = listforblow_c(date,qq,machine[i].idm,true)
    qlist.push(c)
    c = listforblow_c(date,qq,machine[i].idm,false)
    qlist.push(c)
  }
  return qlist
}
function listforblow_c(date,query,m,flag){
  let qlist = {
    disp:" ",
    name:" ",
    summary:" ",
    color:"",
    id:0
  }
  let qq = []
  if(query.length > 0){
    qq = query.filter(function(val){
      return val.blow_machine === m
    })
  }
  if(qq.length==1){
    qlist.color = flag ? qq[0].color : ""
    qlist.id = qq[0].id
    const sdatep1 = new Date(sdate().getFullYear(),sdate().getMonth(),sdate().getDate()+1)
    if(date_to_str(date)==date_to_str(sdatep1) || date_to_str(date)==qq[0].start_date){
      qlist.name = qq[0].name
      qlist.summary = qq[0].summary
    }
  }else if(qq.length==0){
  }else{
    qlist.name = "競合"
    qlist.summary = "エラー"
    qlist.color = "red"
  }
  qlist.disp = flag ? qlist.name : qlist.summary
  return qlist
}
function listforinj(date,query,machine){
  let qlist = []
  qq = query.filter(function(val){
    return (str_to_date(val.start_date) <= date && str_to_date(val.end_date) >= date)
  })
  for(var i=0;i<machine.length;i++){
    let c = listforinj_c(date,qq,machine[i].idm,true)
    qlist.push(c)
    c = listforinj_c(date,qq,machine[i].idm,false)
    qlist.push(c)
  }
  return qlist
}
function listforinj_c(date,query,m,flag){
  let qlist = {
    disp:" ",
    name:" ",
    summary:" ",
    color:"",
    id:0
  }
  let qq = []
  if(query.length > 0){
    qq = query.filter(function(val){
      return val.inj_machine === m
    })
  }
  if(qq.length==1){
    qlist.color = flag ? qq[0].color : ""
    qlist.id = qq[0].id
    const sdatep1 = new Date(sdate().getFullYear(),sdate().getMonth(),sdate().getDate()+1)
    if(date_to_str(date)==date_to_str(sdatep1) || date_to_str(date)==qq[0].start_date){
      qlist.name = qq[0].name
      qlist.summary = qq[0].summary
    }
  }else if(qq.length==0){
  }else{
    qlist.name = "競合"
    qlist.summary = "エラー"
    qlist.color = "red"
  }
  qlist.disp = flag ? qlist.name : qlist.summary
  return qlist
}
function listforjusigata(date,query,js){
  let qlist = []
  const q = query.filter((v)=>(str_to_date(v.start_date) <= date && date <= str_to_date(v.end_date) && v.plamold))
  for(var i=0;i<js.length;i++){
    const qq = q.filter((v) => (v.blow_machine === js[i].idm ))
    if(qq.length==1) qlist.push(qq[0].color)
    else if(qq.length>1) qlist.push("red")
    else qlist.push("")
  }
  return qlist
}
async function sleep(m){
  return new Promise((resolve,reject) => {
    setTimeout(()=>{resolve()},m)
  })
}
async function inittable(){
  await sq.resetTable()
  await sq.createBlowtable()
  await sq.createInjtable()
  await sq.createHolidaytable()
  await sleep(100)
  m_blow = await sq.get_query_blow_machines()
  m_inj = await sq.get_query_inj_machines()
  await sq.dammydata()
}
