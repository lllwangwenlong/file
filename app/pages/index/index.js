//index.js
//获取应用实例
import { fetch, login, updateTimeDisplay } from "../../utils/util.js"
const app = getApp()

Page({
  data: {
    swiperData: [],
    mainContent:[],
    indicatorDots: true,
    autoplay: true,
    circular:true,
    interval: 3000,
    duration: 1000,
    isLoading:false,
    pn:1,
    hasMore:true,
    moreBooks:false
  },
  onLoad () {
    login()
    Promise.all([this.getData(), this.getContent()]).then(() => {
      this.setData({
        moreBooks: true
      })
    })
  },
  getData(){
    return new Promise((resolve,reject)=>{
      this.setData({
        isLoading: true
      })
      fetch.get('/swiper').then(res => {//获取轮播图数据
        resolve()
        console.log(res)
        this.setData({
          swiperData: res.data,
          isLoading: false
        })
      }).catch(err => {
        reject()
        this.setData({
          isLoading: false
        })
      })
    })
  },
  getContent(){
    return new Promise(resolve=>{
      this.setData({
        isLoading: true
      })
      fetch.get('/category/books').then(res => {//获取图书列表数据
        resolve()
        console.log(res)
        let newArr1 = res.data
        newArr1.forEach(item1=> {//显示更新时间
          let newArr2 = item1.books;
          newArr2.forEach(item2=>{
            let time = updateTimeDisplay(item2.updateTime);
            item2.time = time;
          })
        })
        console.log(newArr1)
        this.setData({
          mainContent: newArr1,
          isLoading: false
        })
      })
    })
  },
  jumpBook(e){//跳转图书详情
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/details/details?id=${id}`,
    })
  },
  onPullDownRefresh(){//下拉刷新数据
    Promise.all([this.getData(),this.getContent()]).then(()=>{
      this.setData({
        pn: 1,
        hasMore: true
      })
      wx.stopPullDownRefresh();
    })
  },
  getMoreData(){//加载数据函数
    return new Promise(resolve => {
      fetch.get('/category/books',{pn:this.data.pn}).then(res => {
        console.log(res)
        let newArr1 = res.data
        newArr1.forEach(item1 => {//显示更新时间
          let newArr2 = item1.books;
          newArr2.forEach(item2 => {
            let time = updateTimeDisplay(item2.updateTime);
            item2.time = time;
          })
        })
        let newArr3 = [...this.data.mainContent, ...newArr1];
        this.setData({
          mainContent: newArr3
        })
        resolve(res)
      })
    })
  },
  onReachBottom() {//上拉加载数据
    if(this.data.hasMore){
      this.setData({
        pn: this.data.pn + 1
      })
      this.getMoreData().then((res) => {
        console.log(res)
        if (res.data.length < 2) {
          this.setData({
            hasMore: false
          })
        }
      })
    }  
  }
})
