// pages/mystudy/mystudy.js
import { fetch, updateTimeDisplay } from "../../utils/util.js"

Page({
  data: {
    readBooks:[],
    alreadyRead:false,
    isLoading: false,
  },
  onLoad: function (options) {
    this.getData()
  },
  getData(){
      this.setData({
        isLoading: true
      })
      fetch.get('/readList').then(res => {
        let percent = "";
        let newArr = res.data;
        for (let i = 0; i < newArr.length; i++) {
          let r = newArr[i].title.index;
          let t = newArr[i].title.total;
          percent = r / t * 100;
          let time = updateTimeDisplay(newArr[i].updatedTime);
          newArr[i].percent = percent.toFixed(0);
          newArr[i].time = time;
        }
          this.setData({
            readBooks: newArr,
            alreadyRead: true,
            isLoading: false
        })
      }).catch(err => {
        this.setData({
          isLoading: false
      })
    })
  },
  onPullDownRefresh(){
    fetch.get('/readList').then(res => {
      console.log(res)
      let percent = "";
      let newArr = res.data;
      for (let i = 0; i < newArr.length; i++) {
        let r = newArr[i].title.index;
        let t = newArr[i].title.total;
        percent = r / t * 100;
        newArr[i].percent = percent.toFixed(0)
      }
      if (res.code == 200) {
        this.setData({
          readBooks: newArr,
          alreadyRead: true
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  onShow() {
    this.getData()
  },
  onShareAppMessage: function () {
  
  }
})