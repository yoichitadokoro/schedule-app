var edit_blow_schedule = new Vue({
  el: '#edit_blow',
  async mounted(){
//    await eel.GetBlowMachine()((res) => {
    await window.api.invoke("GetBlowMachine")
    .then((res)=>{
      this.res = res
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.GetEditBlowSchedule()((res) =>{
    await window.api.invoke("GetEditBlowSchedule")
    .then((res)=>{
      this.blowmachine = res['blow_machine']
      this.name = res['name']
      this.summary = res['summary']
      this.PFgeom = res['PFgeom']
      this.PFnum = res['PFnum']
      this.start_date = res['start_date']
      this.end_date = res['end_date']
      this.plamold = res['plamold']
      this.plantPF = res['plantPF']
      this.color = res['color']
      this.id1 = res['id']
    })
    .catch((err)=>{
      alert(err)
    })
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
    id1:0,
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
//      await eel.CheckEditBlow(this.blowmachine,this.start_date,this.end_date,this.id1)((res) => {
      await window.api.invoke("CheckEditBlowSchedule",{machine:this.blowmachine,sdate:this.start_date,fdate:this.end_date,id1:this.id1})
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
    async update(){
      const now = new Date()
      const datalist = [this.id1,this.blowmachine,this.name,this.summary,this.PFgeom,this.PFnum,this.start_date,this.end_date,this.plamold,this.plantPF,this.color,this.result,now.toString()];
//      await eel.SetEditBlowSchedule(datalist)((res) => {
      await window.api.invoke("SetEditBlowSchedule",datalist)
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
    async del(){
      if(window.confirm('削除してよろしいですか？')){
//          await eel.DeleteBlowSchedule(this.id1)((res) => {
          await window.api.invoke("DeleteBlowSchedule",this.id1)
          .then((res)=>{
            if(res == 1){
              this.pstep = 2;
            }
          })
          .catch((err)=>{
            alert("失敗しました")
            this.pstep = 0;
            window.close();
          })
      }
    },
  }
})
