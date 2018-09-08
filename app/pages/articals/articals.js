// pages/articals/articals.js
import { fetch } from "../../utils/util.js"
const app = getApp()

Page({
  data: {
    titleId: "",
    bookId: "",
    article: "",
    catalog: [],
    isLoading: false,
    isShow:false,
    font:40,
    index:""
  },
  onLoad: function(options) {
    this.setData({
      titleId: options.id,
      bookId: options.bookId
    })
    this.getData();
    this.getCatalog();
  },
  getData() {
    this.setData({
      isLoading: true
    })
    fetch.get(`/article/${this.data.titleId}`).then(res => {
      console.log(res)
        this.setData({
          article: res.data.article.content,
          index:res.data.article.index,
          isLoading: false
        })
      }).catch(err => {
        this.setData({
          isLoading: false
        })
      })
  },
  getCatalog(){
    fetch.get(`/titles/${this.data.bookId}`).then(res => {
      this.setData({
        catalog: res.data,
        isLoading: false
      })
    }).catch(err => {
      this.setData({
        isLoading: false
      })
    })
  },
  toggleMulu(){
    let isShow = !this.data.isShow;
    this.setData({
      isShow
    })
  },
  handleArticle(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    this.setData({
      titleId:id
    })
    this.getData()
    this.toggleMulu()
  },
  handleAdd(){
    this.setData({
      font:this.data.font+2
    })
  },
  handleReduce(){
    if(this.data.font<=24){
      wx.showModal({
        title: '提示',
        content: '字体太小啦!',
        showCancel: false
      })
    }else{
      this.setData({
        font: this.data.font - 2
      })
    }
  },
  handlePrev() {
    let catalog = this.data.catalog;
    if (catalog[this.data.index - 1]) {
      this.setData({
        titleId: catalog[this.data.index - 1]._id,
        font: 40
      }),
        this.getData();
    } else {
      wx.showToast({
        title: '这是第一章啦!',
      })
    }
  },
  handleNext(){
    let catalog = this.data.catalog;
    if (catalog[this.data.index + 1]){
      this.setData({
        titleId: catalog[this.data.index + 1]._id,
        font:40
      }),
        this.getData();
    }else{
      wx.showToast({
        title: '这是最后一章啦!',
      })
    }
  }
})