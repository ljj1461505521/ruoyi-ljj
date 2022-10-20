<template>
  <div class="playercontainer" :id="id" ></div>
</template>

<script>
//import { TcPlayer } from '../../../public/js/TcPlayer-module-2.3.3.js';
export default {
props:['url','idIndex'],//url：视频流链接  idIndex：id的索引
components: {},
  data() {
    return {
      player:null,
      id:null
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
     this.id = `playercontainer_${this.idIndex}`;
     this.play(this.id);
  },
  methods: {
     //https://cloud.tencent.com/document/product/881/20207   文档
     play(id){
       setTimeout(()=>{
         this.player =  new TcPlayer(id, {
           "m3u8": this.url,//hls  格式
           //"flv": "http://2157.liveplay.myqcloud.com/live/2157_358535a.flv", //增加了一个 flv 的播放地址，用于PC平台的播放 请替换成实际可用的播放地址
           "autoplay" : true,       //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
           "poster" : "http://www.test.com/myimage.jpg",
           "width" :  '100%',//视频的显示宽度，请尽量使用视频分辨率宽度
           "height" : '100%',//视频的显示高度，请尽量使用视频分辨率高度
         });
         this.player.mute(true);//必须要静音才能播放  浏览器限制了
         this.player.play();
       },500)
     },
    stop(){
      this.player.pause()
    }
  },
  beforeDestroy() {
    console.log('组将被移除')
    this.player.pause()
    this.player.destroy()
  },
}
</script>

<style  lang='scss'>
.playercontainer{width: 100%;height: 100%}

/*不显示播放器的操作栏*/
.playercontainer .vcp-controls-panel{animation: unset;}
/*.vcp-player{background-color: rgba(0,0,0,0.1);}*/
</style>
