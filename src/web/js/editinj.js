var edit_inj_schedule = new Vue({
  el: '#edit_inj',
  async mounted(){
//    await eel.GetInjMachine()((res) => {
    await window.api.invoke("GetInjMachine")
    .then((res)=>{
      this.res = res
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.GetEditInjSchedule()((res) =>{
    await window.api.invoke("GetEditInjSchedule")
    .then((res)=>{
      this.injmachine = res['inj_machine']
      this.name = res['name']
      this.summary = res['summary']
      this.start_date = res['start_date']
      this.end_date = res['end_date']
      this.color = res['color']
      this.id1 = res['id']
    })
    .catch((err)=>{
      alert(err)
    })
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
        this.m_name = this.res[this.injmachine-1];
      }
//      await eel.CheckEditInj(this.injmachine,this.start_date,this.end_date,this.id1)((res) => {
      await window.api.invoke("CheckEditInjSchedule",{machine:this.injmachine,sdate:this.start_date,fdate:this.end_date,id1:this.id1})
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
      const datalist = [this.id1,this.injmachine,this.name,this.summary,this.start_date,this.end_date,this.color,this.result,now.toString()];
//      await eel.SetEditInjSchedule(datalist)((res) => {
      await window.api.invoke("SetEditInjSchedule",datalist)
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
//          await eel.DeleteInjSchedule(this.id1)((res) => {
          await window.api.invoke("DeleteInjSchedule",this.id1)
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
