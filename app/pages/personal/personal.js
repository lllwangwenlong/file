// pages/personal/personal.js
import {fetch} from "../../utils/util.js"

Page({
  data: {
    useInfo:{},
    collectnum:"",
    isLoading: false,
  },
  onLoad: function (options) {
    wx.getUserInfo({
      success:(res)=>{
        console.log(res)
        this.setData({
          useInfo:res.userInfo
        })
      }
    })
    this.getData()
  },
  onPullDownRefresh() {
    this.getData();
    wx.stopPullDownRefresh()
  },
  getData(){
    this.setData({
      isLoading: true
    })
    fetch.get('/collection/total').then(res=>{
      this.setData({
        collectnum:res.data,
        isLoading: false
      })
    }).catch(err => {
      this.setData({
        isLoading: false
      })
    })
  },
  jumpCollect(){
    wx.navigateTo({
      url: '/pages/collectlist/collectlist',
    })
  },
  onShow(){
    this.getData()
  },
  onShareAppMessage: function () {
  
  }
})