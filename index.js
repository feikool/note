const color = ['red', 'green', 'blue', 'gold'];
var app = new Vue({
  el: "#app",
  filters: {}, //过滤器  在标签中使用{{title|format}}  title为传入format函数的值
  data: {
    inp:'',
    text:[
    '来创建一条便签吧！',
    '方法：Ctrl + 鼠标双击,创建一条新的便签...',
    '方法：点击右上角删除当前便签...',
    '方法：也可以选中便签按下键盘<Delete>删除...',
    '提示：便签信息，只能保存在本地喔。',
    '提示2',
    '提示3',
    '提示4',
    '提示5'
  ],
    reply:"便签搜索",
    title: '便签应用',
    note: [{
      id: 1,
      title: "欢迎使用",
      content: "写下你的第一个便签",
      top: 20,
      left: 20,
      thenm: "red",
      color: "rgba(26, 70, 160, 0.5)"
    }],
    moveinfo: {
      state: false,
      index: null,
      position: {}
    },
    sou:false,
    souarr:[]
  },
  methods: {
    addNote(e) {
      let id;
      if (this.note.length) {
        id = this.note[this.note.length - 1].id + 1;
      } else {
        id = 1;
      }
      let title = `${this.format()}`;
      let content = '';
      let top = e.clientY - 80;
      let left = e.clientX - 170;
      let color = (() => {
        let r = Math.floor(Math.random() * 100 + 1);
        let g = Math.floor(Math.random() * 100 + 1);
        let b = Math.floor(Math.random() * 255 + 1);
        return `rgba(${r},${g},${b},.5)`;
      })();
      this.moveinfo.index = id - 1;
      this.note.push({
        id,
        title,
        content,
        top,
        left,
        color
      });
    },
    md(i, e) {
      this.moveinfo.state = true;
      this.moveinfo.index = i;
      this.moveinfo.position.x = e.offsetX;
      this.moveinfo.position.y = e.offsetY;
    },
    mv(e) {
      let cw = this.$refs.container.clientWidth-180;
      let ch = this.$refs.container.clientHeight-250;
      if (this.moveinfo.state) {
        let p = this.$refs.container;
        let top = e.clientY - p.offsetTop - 16;
        let left = e.clientX - p.offsetLeft - 90;
        if(top<=0){
          top=0
        }else if(top>=ch){
          top=ch;
        }
        if(left<=0){
          left=0
        }else if(left>=cw){
          left=cw;
        }
        console.log(top,left)
        this.note[this.moveinfo.index].top = top;
        this.note[this.moveinfo.index].left = left;
      }
    },
    mu() {
      this.moveinfo.state = false;
      this.save();
    },
    save() {
      localStorage.note = JSON.stringify(this.note);
    },
    close(i) {
      this.note.splice(i, 1);
      this.save();
    },
    colors() {
      let r = Math.floor(Math.random() * 255 + 1);
      let g = Math.floor(Math.random() * 255 + 1);
      let b = Math.floor(Math.random() * 255 + 1);
      return `rgba(${r},${g},${b},.5)`;
    },
    format: () => {
      let date = new Date();
      return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      ].join('-');
    },
    changeText(){
      let point = this.$refs.point;
      let len = this.text.length;
      if(point){
        point.innerHTML = `<div class="opc">欢迎使用便签系统</div>`
      }
      if(this.t){
        clearInterval(this.t);
      }else{
        this.t
      }
      this.t= setInterval(()=>{
        let len = Math.floor(Math.random()*(this.text.length-1) +1);
        console.log(len)
        point.innerHTML = `<div class="opc">${this.text[len]}</div>`;
      },5000)

    },
    stopText(){
      clearInterval(this.t);
      return  this.text[0];
    }
  },
  mounted() { //整个#app被解析后调用
    if (localStorage.note) {
      this.note = JSON.parse(localStorage.note);
    }
    document.onkeyup = (e) => {
      if (e && e.keyCode === 46) {
        this.close(this.moveinfo.index);
        this.moveinfo.index = this.note.length ? this.note.length - 1 : null;
      }
    }
  },
  computed() { //计算属性

  },
  created(){

  },
  watch:{
    inp:function(newinp){
      this.souarr = [];
      let tbody = this.$refs.tbody;
      let reg = new RegExp(`${newinp}`);
      for(let i=0;i<this.note.length;i++){
        if(reg.test(this.note[i].title) ||reg.test(this.note[i].content)){
            this.souarr.push(this.note[i]);
        }
      }
    },
    note:function(){
      this.save();
    }
  }
})
