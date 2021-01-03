class pdftest{
  create(fname,cdate,bcal,m_blow,m_inj,jusigata,ishol){
    return new Promise((resolve,reject)=>{
      const fonts = {
        SawarabiGothic: {
          normal: 'src/fonts/SawarabiGothic-Regular.ttf',
          bold: 'src/fonts/SawarabiGothic-Regular.ttf',
        },
        LilitaOne: {
          normal: 'src/fonts/LilitaOne-Regular.ttf',
          bold: 'src/fonts/LilitaOne-Regular.ttf',
          italics: 'src/fonts/LilitaOne-Regular.ttf',
          bolditalics: 'src/fonts/LilitaOne-Regular.ttf'
        },
        IPAg:{
          normal: 'src/fonts/ipag.ttf',
          bold:   'src/fonts/ipag.ttf'
        },
      };
      const PdfPrinter = require('pdfmake');
      const printer = new PdfPrinter(fonts);
      const fs = require('fs');

      const mw = 2
      const mh = 2
      const w = 571 - mw*2
      const h = 403 - mh*2
      const len_inj = m_inj.length*2
      const len_blow = m_blow.length*2
      const len_blowj = jusigata.length
      const len_col = len_inj + len_blow + len_blowj + 2
      let docDefinition = {
        info: {
	        title: '試作予定表',
	        author: '東洋製罐グループホールディングス株式会社',
	        subject: ''+cdate.getFullYear()+'/'+cdate.getMonth(),
        },
        pageSize:'A4',
        pageOrientation:'landscape',
        pageMargins:[mw,mh,mw,mh],
        content: [],
        styles: {
          title: {
            font: 'LilitaOne',
            fontSize: 24,
          },
          h1: {
            font: 'SawarabiGothic',
            fontSize: 18,
            bold: true
          },
          style2: {
            alignment: 'right',
            color: 'blue',
          },
          small:{
            font: 'IPAg',
            fontSize: 7.5,
          }
        },
        defaultStyle: {
          font: 'IPAg',
          fontSize: 9.3,
        }
      };
      let table_c = []
// 一行目
      let tbl1 = Array(len_col).fill('')
      tbl1[0] = {text:""+cdate.getFullYear(),colSpan:2}
      tbl1[2] = ""+(cdate.getMonth()+1)
      tbl1[3] = {text:"",colSpan:len_inj+len_blow+len_blowj-1}
      table_c.push(tbl1)
// 二行目
      let tbl2 = Array(len_col).fill('')
      tbl2[0] = {text:"",colSpan:2}
      tbl2[2] = {text:"INJ",colSpan:len_inj,alignment:"center"}
      tbl2[len_inj+2] = {text:"BLOW",colSpan:len_blow+len_blowj,alignment:"center"}
      table_c.push(tbl2)
// 三行目
      let tbl3 = [
        {text:"日",rowSpan:2,alignment:"center",margin:[0,7,0,0]},
        {text:"曜",rowSpan:2,alignment:"center",margin:[0,7,0,0]}
      ]
      for(var i=0;i<m_inj.length;i++){
        tbl3.push({text:m_inj[i].dispname,colSpan:2,rowSpan:2,alignment:"center",margin:[0,7,0,0]})
        tbl3.push('')
      }
      for(var i=0;i<m_blow.length;i++){
        tbl3.push({text:m_blow[i].dispname,colSpan:2,rowSpan:2,alignment:"center",margin:[0,7,0,0]})
        tbl3.push('')
      }
      tbl3.push({text:"樹脂型",colSpan:len_blowj,alignment:"center"})
      for(var i=0;i<len_blowj-1;i++){
        tbl3.push('')
      }
      table_c.push(tbl3)
// 四行目
      let tbl4 = Array(len_col).fill('')
      for(var i=0;i<len_blowj;i++){
        tbl4[i+len_col-len_blowj] = jusigata[i].dispname
      }
      table_c.push(tbl4)
// 五行目以降
      for(var i=0;i<bcal.length;i++){
        const cc = this.todaycolor(bcal[i].holcolor,ishol)
        const a = [{text:""+bcal[i].day,fillColor:cc},{text:""+bcal[i].weekday,fillColor:cc}]
        for(var j=0;j<bcal[i].listforinj.length;j++){
          const txt = this.textcut(bcal[i].listforinj[j].disp,j)
          const cl = bcal[i].listforinj[j].color == "" ? cc : bcal[i].listforinj[j].color
          a.push({text:txt,fillColor:cl,style:"small",margin:0})
        }
        for(var j=0;j<bcal[i].listforblow.length;j++){
          const txt = this.textcut(bcal[i].listforblow[j].disp,j)
          const cl = bcal[i].listforblow[j].color == "" ? cc : bcal[i].listforblow[j].color
          a.push({text:txt,fillColor:cl,style:"small",margin:0})
        }
        for(var j=0;j<bcal[i].listforjusigata.length;j++){
          const cl = bcal[i].listforjusigata[j] == "" ? cc : bcal[i].listforjusigata[j]
          a.push({text:"",fillColor:cl})
        }
        table_c.push(a)
      }
// セル幅設定
      const dw = 10
      const jw = 15
      let table_w = [dw,dw]
      for(var j=0;j<m_inj.length;j++){
        table_w.push((w - dw*2 - len_blowj*jw)/(len_inj+len_blow)*2*0.4)
        table_w.push((w - dw*2 - len_blowj*jw)/(len_inj+len_blow)*2*0.6)
      }
      for(var j=0;j<m_blow.length;j++){
        table_w.push((w - dw*2 - len_blowj*jw)/(len_inj+len_blow)*2*0.4)
        table_w.push((w - dw*2 - len_blowj*jw)/(len_inj+len_blow)*2*0.6)
      }
      for(var j=0;j<bcal[0].listforjusigata.length;j++){
        table_w.push(jw)
      }
//      const tmp = Array(len_col).fill(w/len_col)
// 表の作成
      let con = [
	     	{
    	   		table: {
              heights:8,
              widths: table_w,
              margin:0,
				      body: table_c
			      }
		    },
      ]
      docDefinition.content.push(con)

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(fname));
      pdfDoc.end()
      resolve(fname)
    })
  }
  todaycolor(def,ishol){
    let cc = def
    if(cc == "lightgreen"){
      if(ishol) cc = "lightgray"
      else cc = ""
    }
    return cc
  }
  textcut(str,j){
    let cut = str
    if(j % 2 == 0){
      cut = str.length > 2 ? str.substr(0,2) : str
    }else{
      cut = str.length > 3 ? str.substr(0,3) : str
    }
    return cut
  }
}
module.exports = pdftest
