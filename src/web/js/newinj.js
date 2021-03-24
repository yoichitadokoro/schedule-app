const {ipcRenderer} = require('electron')

$(function(){
  $('#button_success').on('click', function() {
      window.opener.postMessage('message')
      window.close();
  })
})

var new_inj_schedule = new Vue({
  el: '#new_inj',
  async mounted(){
//    await eel.GetInjMachine()((res) => {
    await ipcRenderer.invoke("GetInjMachine")
    .then((res)=>{
      this.res = res
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.getTodayVue()((today) => {
/*    await ipcRenderer.invoke("getTodayVue")
    .then((today)=>{
      this.start_date = today;
      this.end_date = today;
    })
    .catch((err)=>{
      alert(err)
    })*/
    await ipcRenderer.invoke("getInitialVue")
    .then((res)=>{
      this.start_date = res.date
      this.end_date = res.date
      this.injmachine = res.machine
    })
    .catch((err)=>{
      alert(err)
    })
    const rdm_r = Math.floor(Math.random()*128)+127
    const rdm_g = Math.floor(Math.random()*128)+127
    const rdm_b = Math.floor(Math.random()*128)+127
    this.color = "#"+rdm_r.toString(16)+rdm_g.toString(16)+rdm_b.toString(16)
  },
  data: {
    res:[],
    injmachine:1,
    name:'',
    summary:'',
    start_date:'',
    end_date:'',
    color:'#ffff00',
    result:0,
    err:[],
    warn:[],
    pstep:0,
    m_name:[],
  },
  methods: {
    async entry(){
      var i_err = 0;
      var d_start = new Date(this.start_date);
      var d_end = new Date(this.end_date);
      this.err = [];
      if(this.name=='') {
        this.err.push('担当者名を入力してください');
        i_err++;
      }
      if(this.summary==''){
        this.err.push('案件名を入力してください');
        i_err++;
      }
      if(d_start.getTime() > d_end.getTime()){
        this.err.push('終了日は開始日よりも後にしてください');
        i_err++;
      }
      if(i_err==0){
        this.pstep = 1;
        this.m_name = this.res[this.injmachine-1];
      }
//      await eel.CheckNewInj(this.injmachine,this.start_date,this.end_date)((res) => {
      await ipcRenderer.invoke("CheckNewInj",{machine:this.injmachine,sdate:this.start_date,fdate:this.end_date})
      .then((res)=>{
        this.warn = res
        if(res.length > 0){
          this.result = 1;
        }
      })
      .catch((err)=>{
        alert(err)
      })
    },
    async register(){
      const now = new Date()
      const datalist = [this.injmachine,this.name,this.summary,this.start_date,this.end_date,this.color,this.result,now.toString()];
//      await eel.NewInjSchedule(datalist)((res) => {
      await ipcRenderer.invoke("NewInjSchedule",datalist)
      .then((res)=>{
        if(res == 1){
          this.pstep = 2;
        }
      })
      .catch((err)=>{
        alert("登録に失敗しました")
        this.pstep = 0;
        window.close();
      })
    },
    backp(){
      this.pstep = 0;
    },
    dataChanged(){
      this.warn_flag = 0;
    },
    plus_day_sdate(){
      let d = new Date(this.start_date)
      d.setDate(d.getDate()+1)
      this.start_date = d.getFullYear() + '-' + ('00'+(d.getMonth()+1)).slice(-2) + '-' + ('00'+d.getDate()).slice(-2)
    },
    minus_day_sdate(){
      let d = new Date(this.start_date)
      d.setDate(d.getDate()-1)
      this.start_date = d.getFullYear() + '-' + ('00'+(d.getMonth()+1)).slice(-2) + '-' + ('00'+d.getDate()).slice(-2)
    },
  }
})
