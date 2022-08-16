<!--
 * @Author: yamei94 1016112504@qq.com
 * @Date: 2022-08-15 20:39:13
 * @LastEditors: yamei94 1016112504@qq.com
 * @LastEditTime: 2022-08-15 22:42:31
 * @FilePath: /rrweb-demo/src/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />
  <button @click="handleReplayer">回放</button>
</template>

<script>
let events = [];
import HelloWorld from "./components/HelloWorld.vue";
export default {
  name: "App",
  components: {
    HelloWorld,
  },
  methods: {
    handleReplayer() {
      fetch("http://127.0.0.1:8888/list", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(res => {
        if (res.ok) {
          //如果取数据成功
          res.json().then(data => {
            //转化为json数据进行处理
            console.log(data);
            if(data.length>2){
              const replayer = new rrweb.Replayer(data);
              replayer.play();
            }
          });
        }
      });
    },
  },
  mounted() {
    const eventsMatrix = [[]];
    rrweb.record({
      emit(event, isCheckout) {
        console.log('event, isCheckout',event, isCheckout)
        // isCheckout is a flag to tell you the events has been checkout
        if (isCheckout) {
          eventsMatrix.push([]);
        }
        const lastEvents = eventsMatrix[eventsMatrix.length - 1];
        lastEvents.push(event);
      },
      checkoutEveryNth: 200, // checkout every 200 events
    });
    window.onerror = function () {
      const len = eventsMatrix.length;
      const events = eventsMatrix[len - 2].concat(eventsMatrix[len - 1]);
      const body = JSON.stringify({ events });
      fetch("http://127.0.0.1:8888/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }).then(res => {
        if (res.ok) {
          //如果取数据成功
          res.json().then(data => {
            //转化为json数据进行处理
            console.log(data);
          });
        }
      });
    };

    // this function will send events to the backend and reset the events array
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
