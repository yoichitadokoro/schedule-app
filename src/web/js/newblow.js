var new_blow_schedule = new Vue({
  el: '#new_blow',
  async mounted(){
//    await eel.GetBlowMachine()((res) => {
    await window.api.invoke("GetBlowMachine")
    .then((res)=>{
      this.res = res
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.getTodayVue()((today) => {
/*    await window.api.invoke("getTodayVue")
    .then((today)=>{
      this.start_date = today;
      this.end_date = today;
    })
    .catch((err)=>{
      alert(err)
    })*/
    await window.api.invoke("getInitialVue")
    .then((res)=>{
      this.start_date = res.date
      this.end_date = res.date
      this.blowmachine = res.machine
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
    blowmachine:1,
    name:'',
    summary:'',
    PFgeom:0,
    PFnum:0,
    start_date:'',
    end_date:'',
    plamold:false,
    plantPF:'',
    color:'#ffff00',
    result:0,
    err:[],
    warn:[],
    pstep:0,
    m_name:[],
  },
  methods: {
    async entry(){
      let i_err = 0;
      const d_start = new Date(this.start_date);
      const d_end = new Date(this.end_date);
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
        this.m_name = this.res[this.blowmachine-1];
      }
//      await eel.CheckNewBlow(this.blowmachine,this.start_date,this.end_date)((res) => {
      await window.api.invoke("CheckNewBlow",{machine:this.blowmachine,sdate:this.start_date,fdate:this.end_date})
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
      const datalist = [this.blowmachine,this.name,this.summary,this.PFgeom,this.PFnum,this.start_date,this.end_date,this.plamold,this.plantPF,this.color,this.result,now.toString()];
//      await eel.NewBlowSchedule(datalist)((res) => {
      await window.api.invoke("NewBlowSchedule",datalist)
      .then((res)=>{
        if(res == 1){
          this.pstep = 2;
        }
      })
      .catch((err)=>{
        alert("登録に失敗しました"+err)
        this.pstep = 0
        window.close()
      })
    },
    backp(){
      this.pstep = 0;
    },
    dataChanged(){
      this.warn_flag = 0;
    },
  }
})
