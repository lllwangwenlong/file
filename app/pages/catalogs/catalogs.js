// pages/catalogs/catalogs.js
import { fetch } from "../../utils/util.js"

Page({
  data: {
    bookId:"",
    bookCatalogs:{},
    isLoading: false,
  },
  onLoad: function (options) {
    this.setData({
      bookId:options.id
    })
    this.getData();
  },
  getData(){
    this.setData({
      isLoading: true
    })
    fetch.get(`/titles/${this.data.bookId}`).then(res=>{
      this.setData({
        bookCatalogs:res.data,
        isLoading: false
      })
    }).catch(err => {
      this.setData({
        isLoading: false
      })
    })
  }
})