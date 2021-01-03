var dnav = new Vue({
  el: '#datenavtab',
  async mounted(){
//    await eel.DateNavi()((context) => {
//    const context = await window.api.invoke("DateNavi")
      await window.api.invoke("DateNavi")
      .then((context) => {
          this.context = context
          this.tabs = context['tabs']
          this.yy = context['year']
          this.mm = context['month']
          console.log(context)
        })
      .catch((err) => {
          alert(err)
        })
  },
  data: {
    context: [],
    res:0,
    tabs:0,
    yy:2000,
    mm:1,
  },
  methods:{
    async href_prev(){
//      await eel.PostDateNavi(this.context['prev'],this.tabs)((res) => {
//      const res = await window.api.invoke("PostDateNavi",{date:this.context['prev'],tabs:this.tabs})
      await window.api.invoke("PostDateNavi",{date:this.context['prev'],tabs:this.tabs})
      .then((res) => {
        this.res = res
        console.log(res)
      })
      .catch((err)=>{
        alert(err)
      })
    },
    async href_next(){
//      await eel.PostDateNavi(this.context['next'],this.tabs)((res) => {
//      const res = await window.api.invoke("PostDateNavi",{date:this.context['next'],tabs:this.tabs})
      await window.api.invoke("PostDateNavi",{date:this.context['next'],tabs:this.tabs})
      .then((res) => {
        this.res = res
        console.log(res)
      })
      .catch((err)=>{
        alert(err)
      })
    },
    async dchange(){
      const gdate = this.yy + '-' + ('00'+this.mm).slice(-2) + '-01'
//      await eel.PostDateNavi(gdate,this.tabs)((res) => {
//      const res = await window.api.invoke("PostDateNavi",{date:gdate,tabs:this.tabs})
      await window.api.invoke("PostDateNavi",{date:gdate,tabs:this.tabs})
      .then((res)=>{
        this.res = res
        window.location.reload()
      })
      .catch((err)=>{alert(err)})
    },
    dateinputModal(){
      this.$refs.year.focus()
    },
  }
})
var maincontent = new Vue({
  el: '#maincontent',
  async mounted(){
//    await eel.DateNavi()((res) => {
//    const res1 = await window.api.invoke("DateNavi")
    await window.api.invoke("DateNavi")
    .then((res)=>{
      this.dnav = res
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.BlowScheduleList()((res) => {
//    const res2 = await window.api.invoke("BlowScheduleList")
    await window.api.invoke("BlowScheduleList")
    .then((res)=>{
      this.blowlist = res
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.InjScheduleList()((res) => {
//    const res3 = await window.api.invoke("InjScheduleList")
    await window.api.invoke("InjScheduleList")
    .then((res)=>{
      this.injlist = res
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.GetBlowJusigata()((res) => {
//    const res4 = await window.api.invoke("GetBlowJusigata")
    await window.api.invoke("GetBlowJusigata")
    .then((res)=>{
      this.jusigata = res
      this.len_jusi = res.length
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.GetBlowMachine()((res) => {
//    const res5 = await window.api.invoke("GetBlowMachine")
    await window.api.invoke("GetBlowMachine")
    .then((res)=>{
      this.blowmachine = res
      this.len_blow = res.length
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.GetInjMachine()((res) => {
//    const res6 = await window.api.invoke("GetInjMachine")
    await window.api.invoke("GetInjMachine")
    .then((res)=>{
      this.injmachine = res
      this.len_inj = res.length
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.BlowInjCalendar()((res) => {
//    const res7 = await window.api.invoke("BlowInjCalendar")
    await window.api.invoke("BlowInjCalendar")
    .then((res)=>{
      this.blowinjcal = res
      this.len_sche = res.length
    })
    .catch((err)=>{
      alert(err)
    })
  },
  data: {
    blowlist:[],
    injlist:[],
    dnav:[],
    blowinjcal:[],
    jusigata:[],
    blowmachine:[],
    injmachine:[],
    len_blow:2,
    len_inj:2,
    len_jusi:2,
    len_sche:30,
    res:0
  },
  methods:{
    async edit_blows(id1){
//      await eel.PostEditBlowSchedule(id1)((res) => {
      await window.api.invoke("PostEditBlowSchedule",{id1:id1})
      .then((res)=>{
        this.res = res
      })
      .catch((err)=>{
        alert(err)
      })
    },
    async edit_injs(id1){
//      await eel.PostEditInjSchedule(id1)((res) => {
      await window.api.invoke("PostEditInjSchedule",{id1:id1})
      .then((res)=>{
        this.res = res
      })
      .catch((err) => {
        alert(err)
      })
    },
    calendar_b1(i){
      if(i % 2 == 1) return "black"
      else return ""
    },
    calendar_b2(i){
      if(i % 2 == 1) return 1
      else return 0
    },
    async newinj_calendar(i,kk){
      if(this.blowinjcal[i].listforinj[kk].id==0 && this.blowinjcal[i].listforinj[kk].color=="" && this.blowinjcal[i].holcolor!="lightgray"){
        const date = this.blowinjcal[i].date
        const ma = this.injmachine[parseInt(kk/2)].idm
        await window.api.invoke("PostNewSchedule",{date:date,machine:ma})
        const fn = function(){
         window.open('newinj.html','_blank','width=600,height=750,scrollbars=1,location=0,menubar=0,toolbar=0,status=1,directories=0,resizable=1,left='+(window.screen.width-600)/2+',top='+(window.screen.height-700)/4);
        }
        setTimeout(fn,100);
        return false;
      }
    },
    async newblow_calendar(i,kk){
      if(this.blowinjcal[i].listforblow[kk].id==0 && this.blowinjcal[i].listforblow[kk].color=="" && this.blowinjcal[i].holcolor!="lightgray"){
        const date = this.blowinjcal[i].date
        const ma = this.blowmachine[parseInt(kk/2)].idm
        await window.api.invoke("PostNewSchedule",{date:date,machine:ma})
        const fn = function(){
         window.open('newblow.html','_blank','width=600,height=750,scrollbars=1,location=0,menubar=0,toolbar=0,status=1,directories=0,resizable=1,left='+(window.screen.width-600)/2+',top='+(window.screen.height-700)/4);
        }
        setTimeout(fn,100);
        return false;
      }
    },
    async newinj_list(i){
      if(this.injlist[i].number==""){
        const date = this.dnav.today > this.dnav.current ? this.dnav.today : this.dnav.current
        const ma = this.injlist[i].machineid
        await window.api.invoke("PostNewSchedule",{date:date,machine:ma})
        const fn = function(){
         window.open('newinj.html','_blank','width=600,height=750,scrollbars=1,location=0,menubar=0,toolbar=0,status=1,directories=0,resizable=1,left='+(window.screen.width-600)/2+',top='+(window.screen.height-700)/4);
        }
        setTimeout(fn,100);
        return false;
      }
    },
    async newblow_list(i){
      if(this.blowlist[i].number==""){
        const date = this.dnav.today > this.dnav.current ? this.dnav.today : this.dnav.current
        const ma = this.blowlist[i].machineid
        await window.api.invoke("PostNewSchedule",{date:date,machine:ma})
        const fn = function(){
         window.open('newblow.html','_blank','width=600,height=750,scrollbars=1,location=0,menubar=0,toolbar=0,status=1,directories=0,resizable=1,left='+(window.screen.width-600)/2+',top='+(window.screen.height-700)/4);
        }
        setTimeout(fn,100);
        return false;
      }
    },
  }
})
