var blow_machine = new Vue({
  el: '#blowmachine',
  async mounted(){
//    await eel.GetBlowMachine()((res) => {
    await window.api.invoke("GetBlowMachine")
    .then((res)=>{
      this.blowmachine = res
    })
    .catch((err)=>{
      alert(err)
    })
  },
  data: {
    blowmachine:[],
    id1:0,
    fullname:'',
    dispname:'',
    odr:0,
    jusigata:0,
    res:0
  },
  methods: {
    maru(b){
      if(b) return '○'
      else return ' '
    },
    edit_button(e){
      const m = this.blowmachine[e]
      this.id1 = m['idm']
      this.fullname = m['fullname']
      this.dispname = m['dispname']
      this.odr = m['odr']
      this.jusigata = m['jusigata']
    },
    async dchange(){
      datalist = [this.id1,this.fullname,this.dispname,this.odr,this.jusigata]
//      await eel.SetEditBlowMachine(datalist)((res) => {
      await window.api.invoke("SetEditBlowMachine",datalist)
      .then((res)=>{
        this.res = res
        alert("変更しました")
      })
      .catch((err)=>{
        alert("失敗しました"+err)
      })
//      await eel.GetBlowMachine()((res) => {
      await window.api.invoke("GetBlowMachine")
      .then((res)=>{
        this.blowmachine = res
      })
      .catch((err)=>{
        alert(err)
      })
    },
    async del(e){
      if(window.confirm('削除してよろしいですか？')){
//          await eel.DeleteBlowMachine(e)((res) => {
          await window.api.invoke("DeleteBlowMachine",e)
          .then((res)=>{
            if(res == 1){
              this.res = res
              alert("削除しました")
            }
          })
          .catch((err)=>{
            alert("失敗しました")
          })
//          await eel.GetBlowMachine()((res) => {
          await window.api.invoke("GetBlowMachine")
          .then((res)=>{
            this.blowmachine = res
          })
          .catch((err)=>{
            alert(err)
          })
      }
    },
    add_button(){
      const m = this.blowmachine.slice(-1)[0]
      this.fullname = ''
      this.dispname = ''
      this.odr = m['odr'] + 1
      this.jusigata = 0
    },
    async add(){
      datalist = [this.fullname,this.dispname,this.odr,this.jusigata]
//      await eel.NewBlowMachine(datalist)((res) =>{
      await window.api.invoke("NewBlowMachine",datalist)
      .then((res)=>{
        this.res = res
        alert("追加しました")
      })
      .catch((err)=>{
        alert(err)
      })
//      await eel.GetBlowMachine()((res) => {
      await window.api.invoke("GetBlowMachine")
      .then((res)=>{
        this.blowmachine = res
      })
      .catch((err)=>{
        alert(err)
      })
    },
  }
})
var inj_machine = new Vue({
  el: '#injmachine',
  async mounted(){
//    await eel.GetInjMachine()((res) => {
    await window.api.invoke("GetInjMachine")
    .then((res)=>{
      this.injmachine = res
    })
    .catch((err)=>{
      alert(err)
    })
  },
  data: {
    injmachine:[],
    id1:0,
    fullname:'',
    dispname:'',
    odr:0,
    res:0
  },
  methods: {
    edit_button(e){
      m = this.injmachine[e]
      this.id1 = m['idm']
      this.fullname = m['fullname']
      this.dispname = m['dispname']
      this.odr = m['odr']
    },
    async dchange(){
      datalist = [this.id1,this.fullname,this.dispname,this.odr]
//      await eel.SetEditInjMachine(datalist)((res) => {
      await window.api.invoke("SetEditInjMachine",datalist)
      .then((res)=>{
        this.res = res
        alert("変更しました")
      })
      .catch((err)=>{
        alert(err)
      })
//      await eel.GetInjMachine()((res) => {
      await window.api.invoke("GetInjMachine")
      .then((res)=>{
        this.injmachine = res
      })
      .catch((err)=>{
        alert(err)
      })
    },
    async del(e){
      if(window.confirm('削除してよろしいですか？')){
//          await eel.DeleteInjMachine(e)((res) => {
          await window.api.invoke("DeleteInjMachine",e)
          .then((res)=>{
            if(res == 1){
              this.res = res
              alert("削除しました")
            }
          })
          .catch((err)=>{
            alert("失敗しました"+err)
          })
//          await eel.GetInjMachine()((res) => {
          await window.api.invoke("GetInjMachine")
          .then((res)=>{
            this.injmachine = res
          })
          .catch((err)=>{
            alert(err)
          })
      }
    },
    add_button(){
      const m = this.injmachine.slice(-1)[0]
      this.fullname = ''
      this.dispname = ''
      this.odr = m['odr'] + 1
      this.jusigata = 0
    },
    async add(){
      datalist = [this.fullname,this.dispname,this.odr]
//      await eel.NewInjMachine(datalist)((res) =>{
      await window.api.invoke("NewInjMachine",datalist)
      .then((res)=>{
        this.res = res
        alert("追加しました")
      })
      .catch((err)=>{
        alert(err)
      })
//      await eel.GetInjMachine()((res) => {
      await window.api.invoke("GetInjMachine")
      .then((res)=>{
        this.injmachine = res
      })
      .catch((err)=>{
        alert(err)
      })
    },
  }
})
