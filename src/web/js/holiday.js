var holidayvue = new Vue({
  el: '#holiday',
  async mounted(){
//    await eel.getTodayVue()((res) =>{
    await window.api.invoke("getTodayVue")
    .then((res)=>{
      this.yy = res.split('-')[0]
    })
    .catch((err)=>{
      alert(err)
    })
//    await eel.HolidayList(this.yy)((res) => {
    await window.api.invoke("HolidayList",this.yy)
    .then((res)=>{
      this.lst = res
    })
    .catch((err)=>{
      alert(err)
    })
    const date  = new Date();
    [this.currentYear,  this.currentMonth, this.currentDate] = [this.yy, date.getMonth() + 1, date.getDate()];
  },
  data: {
    lst:[],
    yy:2020,
    res:0,
    today:"",
    selectedDay:"",
    currentYear:0,
    currentMonth:0,
    currentDate:0,
    weeks:["日","月","火","水","木","金","土"],
    calendar:[],
    holidays:[],
    ladd:[],
    ldel:[],
  },
  methods: {
    m_calendar(month){
      const firstday = new Date(this.yy,month,1).getDay();
      const lastdate = new Date(this.yy,month+1,0).getDate();
//      const necessarySpace = firstday == 0 ? 6 : firstday - 1;
      const necessarySpace = firstday;
      const list = [[...Array(necessarySpace)].map(i=>" "), [...Array(lastdate)].map((_, i) => i+1)];
      const week = list.reduce((pre,current) => {pre.push(...current);return pre},[]);
      return this.listToMatrix(week,7)
    },
    listToMatrix(list, elementsPerSubArray) {
        var matrix = [], i, k;
        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }
            matrix[k].push(list[i]);
        }
        return matrix;
    },
    txtcolor(i){
      if(i == 0) return 'sun'
      if(i == 6) return 'satur'
    },
    backcolor(m,d){
      for(let i = 0;i<this.lst.length;i++){
        if(Number(this.lst[i].split('-')[1]) == m && Number(this.lst[i].split('-')[2]) == d) return this.lcheck(m,d)
      }
      for(let i = 0;i<this.ladd.length;i++){
        if(Number(this.ladd[i].split('-')[1]) == m && Number(this.ladd[i].split('-')[2]) == d) return 'holi'
      }
    },
    lcheck(m,d){
      exist = false
      for(let i = 0;i<this.ldel.length;i++){
        if(Number(this.ldel[i].split('-')[1]) == m && Number(this.ldel[i].split('-')[2]) == d) exist = true
      }
      if(!exist) return 'holi'
    },
    classget(i,m,d){
      return this.txtcolor(i) + ' ' + this.backcolor(m,d)
    },
    async prev(){
      this.yy--
//      await eel.HolidayList(this.yy)((res) => {
      await window.api.invoke("HolidayList",this.yy)
      .then((res)=>{
        this.lst = res
      })
      .catch((err)=>{
        alert(err)
      })
    },
    async next(){
      this.yy++
//      await eel.HolidayList(this.yy)((res) => {
      await window.api.invoke("HolidayList",this.yy)
      .then((res)=>{
        this.lst = res
      })
      .catch((err)=>{
        alert(err)
      })
    },
    addlst(i2,m,d){
      hol = this.yy + '-' + ( '00' + m ).slice( -2 ) + '-' + ( '00' + d ).slice( -2 );
      exist = false
      exist2 = false
      if(d!=0){
        for(let i = 0;i<this.lst.length;i++){
          if(this.lst[i] == hol){
            exist = true
            for(let j = 0;j<this.ldel.length;j++){
              if(this.ldel[j] == hol){
                exist2 = true
                this.ldel.splice(j,1)
              }
            }
            if(!exist2) this.ldel.push(hol)
          }
        }
        if(!exist){
          for(let i = 0;i<this.ladd.length;i++){
            if(this.ladd[i] == hol){
              this.ladd.splice(i,1);
              exist = true;
            }
          }
          if(!exist && i2 != 0 && i2 != 6) this.ladd.push(hol);
        }
      }
    },
    async sethol(){
      l1 = this.ladd.length
      l2 = this.ldel.length
      if(l1 > 0){
//        await eel.SetHoliday(this.ladd)((res) => {
        await window.api.invoke("SetHoliday",this.ladd)
        .then((res)=>{
          this.res = res
          this.ladd = []
        })
        .catch((err)=>{
          alert(err)
        })
      }
      if(l2 > 0){
//        await eel.DeleteHoliday(this.ldel)((res) => {
        await window.api.invoke("DeleteHoliday",this.ldel)
        .then((res)=>{
          this.res = res
          this.ldel = []
        })
        .catch((err)=>{
          alert(err)
        })
      }
      alert("更新しました。追加"+l1+"件、削除"+l2+"件")
//      await eel.HolidayList(this.yy)((res) => {
      await window.api.invoke("HolidayList",this.yy)
      .then((res)=>{
        this.lst = res
      })
      .catch((err)=>{
        alert(err)
      })
    },
  },
})
