import instance from "../until/axios"

//请求mock的数据
export function getMinute_k() {
    return new Promise((resolve,reject)=>{
        instance({
            url: "/index/minute_k",
            method: "post"
        }).then(response=>{
            resolve(response.data)
        }).catch(err=>{
            reject(err)
        })
    })
}

//默认数据
export function getMarket() {
    return new Promise((resolve,reject)=>{
        instance({
            url: "/index/market",
            method: "post"
        }).then(response=>{
            resolve(response.data)
        }).catch(err=>{
            reject(err)
        })
    })
}

//日k
export function getDay_k() {
    return new Promise((resolve,reject)=>{
        instance({
            url: "/index/day_k",
            method: "get"
        }).then(response=>{
            resolve(response.data)
        }).catch(err=>{
            reject(err)
        })
    })
}

//周k
export function getWeek_k() {
    return new Promise((resolve,reject)=>{
        instance({
            url: "/index/week_k",
            method: "get"
        }).then(response=>{
            resolve(response.data)
        }).catch(err=>{
            reject(err)
        })
    })
}

//月k
export function getMonth_k() {
    return new Promise((resolve,reject)=>{
        instance({
            url: "/index/month_k",
            method: "get"
        }).then(response=>{
            resolve(response.data)
        }).catch(err=>{
            reject(err)
        })
    })
}
