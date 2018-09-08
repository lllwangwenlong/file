// pages/details/details.js
import { fetch, updateTimeDisplay} from "../../utils/util.js"

Page({
  data: {
    bookId: '',
    bookData:{},
    isDesc:false,
  },
  onLoad: function (options) {
    this.setData({
      bookId:options.id
    })
    this.getData();
  },
  getData(){
    fetch.get(`/book/${this.data.bookId}`).then(res=>{
      let newArr = res;
      let time = updateTimeDisplay(newArr.data.updateTime);
      newArr.data.time = time;
      console.log(newArr)
      this.setData({
        bookData: newArr,
      })
    })
  },
  jumpCatalog(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/catalogs/catalogs?id=${id}`,
    })
  },
  descView(){
    let isDesc = !this.data.isDesc
    this.setData({
      isDesc
    })
  },
  handleCollect(){
    fetch.post('/collection',{
      bookId: this.data.bookId
    }).then(res=>{
      console.log(res)
      if(res.code == 200){
        wx.showToast({
          title: '收藏成功',
          type:'success',
          duration:1000
        })
        let bookData = {...this.data.bookData}
        bookData.isCollect = 1
        this.setData({
          bookData
        })
      }
    })
  },
  deleteCollect(){
    fetch.delete(`/collection/${this.data.bookId}`).then(res => {
      console.log(res)
      wx.showToast({
        title: '取消收藏'
      })
      let bookData = { ...this.data.bookData }
      bookData.isCollect = 0
      this.setData({
        bookData
      })
    })
  },
  onShareAppMessage:function(){
    return{
      title:this.data.bookData.data.title,
      path:`/pages/details/details?id=${this.data.bookId}`,
      imageUrl:this.data.bookData.data.img
    }
  }
})