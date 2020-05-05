<template>
  <div id="app">
      <!--<transition :name="transitionName">-->
            <keep-alive>
                <router-view  v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
          <router-view v-if="!$route.meta.keepAlive">
              <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
          </router-view>
      <!--</transition>-->
  </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            value:"",
            transitionName:''
        }
    },
    computed:{
        // 这里也可以用计算属性控制active的值
    },
    // watch:{
    //     $route(to,from){
    //         if (to.path =='/address' && from.path == '/mine'){
    //             this.transitionName = 'slide-left';
    //         }
    //     }
    // },

    methods:{
    }
}
</script>

<style>
*{padding: 0;margin: 0}
#app {
  font-family:  Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
    font-size: 12px;
}
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    transition:background-color 5000s ease-in-out 0s;
    outline:none;
}
input{
    background-color:rgba(255,255,255,0.6);
}

/*tab样式*/
.van-search{padding: 8px 0px 8px 6px;}
.van-cell{background:none}
/*.van-tabs--line .van-tabs__wrap{height: 37px;font-size: 12px}*/
/*.van-tabs--line{height: 37px}*/
/*.van-tab{line-height: 34px}*/
/*.van-tabs--line{padding-top: 37px}*/
.van-tabbar--fixed{background-color: #f9f9f9}
.van-nav-bar .van-icon{color: #111}
.van-nav-bar__text{color: #111;text-decoration: underline;font-size: 12px}
.van-nav-bar__title {
    margin: 0 auto;
    max-width: 60%;
    color: #323233;
    font-size: 14px;
    font-weight: 500;
}
.van-cell{font-size: 12px}
    .van-picker-column{font-size: 12px}
</style>
