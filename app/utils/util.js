const baseUrl = "https://m.yaojunrong.com"

const fetch = {
  http(url, method, data) {
    return new Promise((resolve, reject) => {
      let token = wx.getStorageSync('token')
      let header = {
        'content-type': 'application/json'
      }
      if(token){
        header.token = token
      }
      wx.request({
        url: baseUrl + url,
        data,
        method,
        header,
        success(res) {
          if(res.header.Token){
            wx.setStorageSync('token', res.header.Token)
          }
          resolve(res.data)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  get(url, data) {
    return this.http(url,'GET',data)
  },
  post(url, data) {
    return this.http(url, "POST", data)
  },
  delete(url, data) {
    return this.http(url, "DELETE", data)
  },
}

const login = ()=>{
  wx.login({
    success(res){
      fetch.post("/login", {
        code: res.code,
        appid: "wx53288737be67d242",
        secret: "e9c847c0dc8732c00f6de1da146bce64"
      }).then(res=>{
        console.log(res)
      })
    }
  })
}

const updateTimeDisplay = (t) => {
  let nowTime = +new Date();
  let time = +new Date(t)
  let timeLag = Math.floor((nowTime - time) / 60000)
  let timeStr = ''
  if (timeLag < 1) {
    timeStr = '刚刚'
  } else if (timeLag >= 1 && timeLag < 60) {
    timeStr = timeLag + '分钟前'
  } else if (Math.floor(timeLag / 60) >= 1 && Math.floor(timeLag / 60) < 24) {
    timeStr = Math.floor(timeLag / 60) + '小时前'
  } else if (Math.floor(timeLag / 1440) >= 1 && Math.floor(timeLag / 1440) < 60) {
    timeStr = Math.floor(timeLag / 1440) + '天前'
  } else if (Math.floor(timeLag / 86400) >= 1 && Math.floor(timeLag / 86400) < 12) {
    timeStr = Math.floor(timeLag / 86400) + '月前'
  } else {
    timeStr = '几年前'
  }
  return timeStr
}

exports.login = login
exports.fetch = fetch
exports.updateTimeDisplay = updateTimeDisplay