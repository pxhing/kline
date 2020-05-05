<template>
  <div id="home">
    <div class="top_title">Kline</div>
    <main>
      <div class="topData flex grayColor">
        <div>
          <p
            class="p1 blackColor"
            :class="{'redColor':Number(market.current_price)>Number(market.yesterday_price),
							'greenColor':Number(market.current_price)<Number(market.yesterday_price)}"
          >
            {{$jq(t5)}}
            <span
              class="redColor"
              v-if="Number(market.current_price)>Number(market.yesterday_price)"
            >↑</span>
            <span
              class="greenColor"
              v-if="Number(market.current_price)<Number(market.yesterday_price)"
            >↓</span>
          </p>
          <p
            class="blackColor"
            :class="{'redColor':Number(market.current_price)>Number(market.yesterday_price),
						'greenColor':Number(market.current_price)<Number(market.yesterday_price)}"
          >
            <span class="span1">{{$jq(t1)}}</span>
            <span>{{$jq(t2)}}%</span>
          </p>
        </div>
        <div>
          <p class="flex">
            今开
            <span
              class="blackColor"
              :class="{'redColor':Number(market.open_price)>Number(market.yesterday_price),
							'greenColor':Number(market.open_price)<Number(market.yesterday_price)}"
            >{{$jq(t6)}}</span>
          </p>
          <p>
            昨收
            <span class="blackColor">{{$jq(t7)}}</span>
          </p>
        </div>
        <div>
          <p>
            最高
            <span class="redColor">{{$jq(t8)}}</span>
          </p>
          <p>
            最低
            <span class="greenColor">{{$jq(t9)}}</span>
          </p>
        </div>
      </div>
      <div class="topData flex grayColor marketData">
        <div>
          <p>
            成交量
            <span class="blackColor">{{t3}}万</span>
          </p>
          <p>
            成交额
            <span class="blackColor">{{t4}}亿</span>
          </p>
        </div>
        <div>
          <p>
            市盈率
            <span class="blackColor">{{t10}}</span>
          </p>
          <p>
            市净率
            <span class="greenColor">{{t11}}</span>
          </p>
        </div>
        <div>
          <p>
            换手率
            <span class="blackColor">{{t12}}%</span>
          </p>
          <p>
            总市值
            <span class="blackColor">{{t13}}亿</span>
          </p>
        </div>
      </div>
      <div class="kline_top flex">
        <div :class="{'ct':ct==0}" @click="cr(0)">分时</div>
        <div :class="{'ct':ct==1}" @click="cr(1)">日K</div>
        <div :class="{'ct':ct==2}" @click="cr(2)">周K</div>
        <div :class="{'ct':ct==3}" @click="cr(3)">月K</div>
      </div>
      <div class="kline_box">
        <Zline v-show="ct==0"></Zline>
        <div v-show="ct!=0">
          <div class="flex kData">
            <p>
              开:
              <span
                :class="open == market.yesterday_price? 'gaColor':open >market.yesterday_price?'oColor':'gColor'"
              >{{open}}</span>
            </p>
            <p>
              收:
              <span
                :class="close == market.yesterday_price? 'gaColor':close >market.yesterday_price?'oColor':'gColor'"
              >{{close}}</span>
            </p>
            <p>
              高:
              <span
                :class="high == market.yesterday_price? 'gaColor':high >market.yesterday_price?'oColor':'gColor'"
              >{{high}}</span>
            </p>
            <p>
              低:
              <span
                :class="low == market.yesterday_price? 'gaColor':low >market.yesterday_price?'oColor':'gColor'"
              >{{low}}</span>
            </p>
            <p v-if="fu!='Infinity'">
              幅:
              <span :class="fu >0? 'oColor':'gColor'">{{$jq(fu) ||pla}}%</span>
            </p>
            <p v-else>
              幅:
              <span class="oColor">--</span>
            </p>
            <p :class="ed >0? 'oColor':'gColor'">
              额:
              <span>{{ed}}</span>
            </p>
          </div>
          <div class="flex kData right">
            <p v-if="m5">
              <span class="pColor">MA5：</span>
              {{m5}}
            </p>
            <p v-else>
              <span class="pColor">MA5：</span>--
            </p>
            <p v-if="m10">
              <span class="yColor">MA10：</span>
              {{m10}}
            </p>
            <p v-else>
              <span class="yColor">MA10：</span>--
            </p>
            <p v-if="m20">
              <span class="bColor">MA20：</span>
              {{m20}}
            </p>
            <p v-else>
              <span class="bColor">MA20：</span>--
            </p>
            <p v-if="m30">
              <span class="cColor">MA30：</span>
              {{m30}}
            </p>
            <p v-else>
              <span class="cColor">MA30：</span>--
            </p>
          </div>
          <div id="myChart" :style="{width: '100vw', height: '7rem'}"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getMarket } from "../api/index";
import { getDay_k } from "../api/index";
import { getWeek_k } from "../api/index";
import { getMonth_k } from "../api/index";
import Zline from "@/components/kline.vue"; //折线
export default {
  name: "home",
  data() {
    return {
      t1: "-- ", //左上角大字号今日价 底左
      t2: "-- ", //左上角大字号今日价 底右
      t3: "--", //成交量
      t4: "--", //成交额
      t5: "--", //左上角大字号今日价
      t6: "--", //今开
      t7: "--", //左收
      t8: "--", //最高
      t9: "--", //最低
      t10: "--", //市盈率
      t11: "--", //市净率
      t12: "--", //换手率
      t13: "--", //总市值
      flag: true, //自选状态
      sendFlag: false,
      ct: 0, //选项卡
      market: {}, //默认数据
      timer: null, //定时请求
      myChart: null, //k线容器
      dataArr: [],
      open: "--",
      close: "--",
      low: "--",
      high: "--",
      ed: "--",
      fu: "--",
      m5: "--",
      m10: "--",
      m20: "--",
      m30: "--",
      url: "/index/day_k", //日周k
      pla: 0
    };
  },
  components: {
    Zline
  },
  mounted() {
    this.myChart = this.$echarts.init(document.getElementById("myChart"));
  },
  methods: {
    getData() {
      //默认数据
      getMarket().then(res => {
        console.log(res.data);
        this.market = res.data;
        this.t1 =
          Math.round(
            (Number(res.data.current_price) -
              Number(res.data.yesterday_price)) *
              100
          ) / 100;
        this.t2 =
          Math.round(
            ((Number(res.data.current_price) -
              Number(res.data.yesterday_price)) /
              Number(res.data.current_price)) *
              10000
          ) / 100;
        this.t3 = Math.round(Math.round(res.data.volume) / 100) / 100;
        this.t4 = Math.round(Math.round(res.data.turnover) / 100) / 100;
        this.t5 = res.data.current_price;
        this.t6 = res.data.open_price;
        this.t7 = res.data.yesterday_price;
        this.t8 = res.data.highest;
        this.t9 = res.data.lowest;
        this.t10 = res.data.pe_ratio;
        this.t11 = res.data.pb_ratio;
        this.t12 = res.data.turnover_rate;
        this.t13 = res.data.total_market_value;
        this.$store.dispatch("priceAction", Number(res.data.yesterday_price));
      });
    },
    cr(e) {
      //选项卡
      if (this.ct != e) {
        this.ct = e;
        if (e == 1) {
          getDay_k().then(res => {
            this.dataArr = [];
            res.data.map(i => {
              i.time =
                "20" +
                i.time.slice(0, 2) +
                "/" +
                i.time.slice(2, 4) +
                "/" +
                i.time.slice(4, 6);
              var arr = [];
              arr[0] = i.time;
              arr[1] = Number(i.open);
              arr[2] = Number(i.close);
              arr[3] = Number(i.low);
              arr[4] = Number(i.high);
              arr[5] = Number(i.volume);
              arr[6] =
                ((Number(i.open) - Number(i.yesterday_close)) /
                  Number(i.yesterday_close)) *
                100;
              arr[7] = Number(i.ma5);
              arr[8] = Number(i.ma10);
              arr[9] = Number(i.ma20);
              arr[10] = Number(i.ma30);
              this.dataArr.push(arr);
            });
            this.open = this.dataArr[0][1];
            this.close = this.dataArr[0][2];
            this.low = this.dataArr[0][3];
            this.high = this.dataArr[0][4];
            this.ed = this.dataArr[0][5];
            this.fu = this.dataArr[0][6];
            this.m5 = this.dataArr[0][7];
            this.m10 = this.dataArr[0][8];
            this.m20 = this.dataArr[0][9];
            this.m30 = this.dataArr[0][10];

            this.setEchartOption();
          });
        } else if (e == 2) {
          getWeek_k().then(res => {
            this.dataArr = [];
            res.data.map(i => {
              i.time =
                "20" +
                i.time.slice(0, 2) +
                "/" +
                i.time.slice(2, 4) +
                "/" +
                i.time.slice(4, 6);
              var arr = [];
              arr[0] = i.time;
              arr[1] = Number(i.open);
              arr[2] = Number(i.close);
              arr[3] = Number(i.low);
              arr[4] = Number(i.high);
              arr[5] = Number(i.volume);
              arr[6] =
                ((Number(i.open) - Number(i.yesterday_close)) /
                  Number(i.yesterday_close)) *
                100;
              arr[7] = Number(i.ma5);
              arr[8] = Number(i.ma10);
              arr[9] = Number(i.ma20);
              arr[10] = Number(i.ma30);
              this.dataArr.push(arr);
            });
            this.setEchartOption();
          });
        } else if (e == 3) {
          getMonth_k().then(res => {
            this.dataArr = [];
            res.data.map(i => {
              i.time =
                "20" +
                i.time.slice(0, 2) +
                "/" +
                i.time.slice(2, 4) +
                "/" +
                i.time.slice(4, 6);
              var arr = [];
              arr[0] = i.time;
              arr[1] = Number(i.open);
              arr[2] = Number(i.close);
              arr[3] = Number(i.low);
              arr[4] = Number(i.high);
              arr[5] = Number(i.volume);
              arr[6] =
                ((Number(i.open) - Number(i.yesterday_close)) /
                  Number(i.yesterday_close)) *
                100;
              arr[7] = Number(i.ma5);
              arr[8] = Number(i.ma10);
              arr[9] = Number(i.ma20);
              arr[10] = Number(i.ma30);
              this.dataArr.push(arr);
            });
            this.setEchartOption();
          });
        }
      }
    },
    setEchartOption() {
      var categoryData = []; //把数组中的日期和数据分离，返回数组中的日期和数据
      var values = [];
      var volumes = [];
      var result = [];
      var upColor = "#ec0000";
      var downColor = "#0FDC48";
      var option = null;

      function splitData(rawData) {
        var categoryData = [];
        var values = [];
        var volumes = [];
        for (var i = 0; i < rawData.length; i++) {
          categoryData.push(rawData[i].splice(0, 1)[0]);
          values.push(rawData[i]);
          volumes.push([
            i,
            rawData[i][4],
            rawData[i][0] > rawData[i][1] ? 1 : -1
          ]);
        }

        return {
          categoryData: categoryData,
          values: values,
          volumes: volumes
        };
      }

      function calculateMA(dayCount, data) {
        var result = [];
        for (var i = 0, len = data.values.length; i < len; i++) {
          if (i < dayCount) {
            result.push("-");
            continue;
          }
          var sum = 0;
          for (var j = 0; j < dayCount; j++) {
            sum += data.values[i - j][1];
          }
          result.push(+(sum / dayCount).toFixed(3));
        }
        return result;
      }
      var data = splitData(this.dataArr);
      let that = this;
      this.myChart.setOption(
        (option = {
          animation: false,
          backgroundColor: "#fff",
          tooltip: {
            //+字准心
            trigger: "axis",
            axisPointer: {
              type: "cross"
            },
            formatter: function(params, v) {
              // console.log(params)
              that.open = params[0].value[1];
              that.close = params[0].value[2];
              that.low = params[0].value[3];
              that.high = params[0].value[4];
              that.ed = params[0].value[5];
              that.fu = params[0].value[6];
              that.m5 = params[0].value[7];
              that.m10 = params[0].value[8];
              that.m20 = params[0].value[9];
              that.m30 = params[0].value[10];
            }
          },
          axisPointer: {
            //k线柱状相连
            link: {
              xAxisIndex: "all"
            },
            label: {
              backgroundColor: "#ccc"
            }
          },
          visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [
              {
                value: 1,
                color: downColor
              },
              {
                value: -1,
                color: upColor
              }
            ]
          },
          grid: [
            {
              //位置
              left: "2%",
              right: "2%",
              top: "6%",
              height: "60%"
            },
            {
              left: "2%",
              right: "2%",
              top: "66%",
              height: "20%"
            }
          ],
          xAxis: [
            {
              show: false,
              type: "category",
              data: data.categoryData,
              scale: true,
              boundaryGap: false,
              splitLine: {
                show: false
              },
              min: "dataMin",
              max: "dataMax",
              axisPointer: {
                label: {
                  show: false
                },
                triggerTooltip: true,
                handle: {
                  show: false,
                  margin: 30,
                  color: "#D6D6D6"
                }
              }
            },
            {
              type: "category",
              gridIndex: 1,
              data: data.categoryData,
              axisLine: {
                lineStyle: {
                  color: "#D6D6D6"
                }
              }
            }
          ],
          yAxis: [
            {
              min: function(value) {
                return Math.round(value.min);
              },
              max: function(value) {
                return Math.round(value.max);
              },
              splitArea: {
                show: false //是否显示分割 灰白背景
              },
              axisLabel: {
                inside: true
              },
              axisTick: {
                show: true,
                inside: true
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#eee"
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#D6D6D6"
                }
              }
            },
            {
              scale: true,
              gridIndex: 1,
              splitNumber: 2,
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              }
            }
          ],
          dataZoom: [
            {
              type: "inside",
              xAxisIndex: [0, 1],
              start: 0,
              end: 100,
              zoomOnMouseWheel: false,
              moveOnMouseMove: false
            }
          ],
          series: [
            {
              name: "Dow-Jones index",
              type: "candlestick",
              data: data.values,
              itemStyle: {
                normal: {
                  color: upColor,
                  color0: downColor,
                  borderColor: null,
                  borderColor0: null
                }
              }
            },
            {
              name: "MA5",
              type: "line",
              data: calculateMA(5, data),
              smooth: true,
              lineStyle: {
                color: "#ff3e8b",
                width: 1
              }
            },
            {
              name: "MA10",
              type: "line",
              data: calculateMA(10, data),
              smooth: true,
              lineStyle: {
                color: "#ffac00",
                width: 1
              }
            },
            {
              name: "MA20",
              type: "line",
              data: calculateMA(20, data),
              smooth: true,
              lineStyle: {
                color: "#27e0ef",
                width: 1
              }
            },
            {
              name: "MA30",
              type: "line",
              data: calculateMA(30, data),
              smooth: true,
              width: 1,
              lineStyle: {
                color: "#ccc",
                width: 1
              }
            },
            {
              name: "Volume",
              type: "bar",
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: data.volumes
            }
          ]
        }),
        true
      );
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style  scoped lang="scss">
#home {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #fff;
  .top_title {
    width: 100%;
    height: 1.2rem;
    text-align: center;
    line-height: 1.2rem;
    color: #fff;
    font-size: 0.4rem;
    background-color: #ff3048;
  }
}
.redColor {
  color: #ff4d4d !important;
}

.greenColor {
  color: #009900 !important;
}

.blackColor {
  color: #333333;
}

.grayColor {
  color: #999999;
}

.pages {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.flex {
  display: flex;
  align-items: center;
}

main {
  height: calc(100vh - 1.2rem);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background: #f4f4f4;
  padding: 0.133333rem 0 0.4rem;
  box-sizing: border-box;
}


.topData {
  background: #fff;
  padding: 0.2rem 0.4rem 0.2rem;
  font-size: 0.346666rem;
  justify-content: space-between;
  border-bottom: 0.026666rem solid #f2f2f2;

  > div {
    flex-grow: 1;

    p {
      line-height: 0.6rem;
    }
  }

  .p1 {
    font-size: 0.633333rem;

    span {
      font-size: 0.4rem;
      margin-left: 0.2rem;
    }
  }

  span {
    margin-left: 0.2rem;
  }

  .span1 {
    margin-right: 0.266666rem;
    margin-left: 0;
  }
}

.kline_top {
  > div {
    flex-grow: 1;
    height: 100%;
    text-align: center;
    line-height: 0.8rem;
    font-size: 0.386666rem;
    color: #91969e;
    box-sizing: border-box;
  }

  .ct {
    color: #ff4d4d;
    background-color: #fff;
    border-bottom: 0.04rem solid #ff4d4d;
  }
}

.panData {
  margin-top: 0.14rem;
  padding: 0 3%;
  background: #fff;

  .same {
    justify-content: space-between;

    > div {
      width: 48%;
      text-align: center;
    }
  }

  .title {
    line-height: 1.066666rem;

    > div {
      border-bottom: 0.026666rem solid #f4f4f4;
      font-size: 0.373333rem;
    }
  }

  .listBox {
    .list {
      > span {
        display: block;
        width: 33.3%;
        text-align: center;
        line-height: 0.8rem;
        font-size: 0.32rem;
        color: #999999;
        overflow: hidden;
      }
    }

    .list span:nth-child(1) {
      text-align: left;
    }

    .list span:nth-child(3) {
      text-align: right;
    }
  }
}
.panData_ {
  margin: 0.14rem 0 1.333333rem 0;
  padding: 0 3%;
  background: #fff;

  .same {
    justify-content: space-between;

    > div {
      width: 48%;
      text-align: center;
    }
  }

  .title {
    line-height: 1.066666rem;

    > div {
      border-bottom: 0.026666rem solid #f4f4f4;
      font-size: 0.373333rem;
    }
  }

  .listBox {
    .list {
      > span {
        display: block;
        width: 33.3%;
        text-align: center;
        line-height: 0.8rem;
        font-size: 0.32rem;
        color: #999999;
        overflow: hidden;
      }
    }

    .list span:nth-child(1) {
      text-align: left;
    }

    .list span:nth-child(3) {
      text-align: right;
    }
  }
}

.kline_box {
  background: #fff;
  min-height: 7.6rem;
  padding-top: 0.2rem;
  overflow: hidden;
}

.right {
  display: flex;
  float: right;
}

.flex {
  display: flex;
  align-items: center;
}

#myChart {
  margin-top: 0.5rem;
}

.kData {
  padding: 0 0.4rem;

  p {
    margin-right: 0.266666rem;
  }

  color: rgb(142, 142, 147);
  .gaColor {
    color: rgb(142, 142, 147);
  }

  .oColor {
    color: rgb(255, 69, 0);
  }

  .gColor {
    color: rgb(5, 170, 59);
  }

  .pColor {
    color: rgb(255, 62, 139);
  }

  .yColor {
    color: rgb(255, 172, 0);
  }

  .bColor {
    color: rgb(39, 224, 239);
  }

  .cColor {
    color: #ccc;
  }
}
</style>
