// pages/collectlist/collectlist.js
import { fetch } from "../../utils/util.js"

Page({
  data: {
    collectBooks: [],
    lock: false,
    select:false,
    isLoading: false,
  },
  onLoad: function (options) {
    this.getData()
  },
  getData(){
    this.setData({
      isLoading: true
    })
    fetch.get('/collection').then(res => {
      console.log(res)
      this.setData({
        collectBooks: res.data,
        isLoading: false
      })
    }).catch(err => {
      this.setData({
        isLoading: false
      })
    })
  },
  onPullDownRefresh() {
    fetch.get('/collection').then(res => {
      console.log(res)
      this.setData({
        collectBooks: res.data
      })
    })
    wx.stopPullDownRefresh()
  },
  jumpBook(event) {//跳转图书详情
    console.log(event)
    let id = event.currentTarget.dataset.id;    
    if(this.data.lock){
     this.setData({
       lock: false
     })
     return ;
    }
    wx.navigateTo({
      url: `/pages/details/details?id=${id}`,
    })
  },
  delCollect(){
    this.setData({
      lock :true,
      select: true
    })
  },
  deleteBook(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let collectBooks = this.data.collectBooks.filter((item)=>{
      return item.book._id !== id
    })
    console.log(collectBooks)
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除书籍',
      success: function (res) {
        if (res.confirm) {
          fetch.delete(`/collection/${id}`).then(res=>{
            console.log(res)
            wx.showToast({
              title: '删除成功'
            })
            that.setData({
              collectBooks,
              select: false
            })
          })
        } else if (res.cancel) {
          that.setData({
            select: false
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
  
  }
})