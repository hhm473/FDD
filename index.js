var app=new Vue({
    el:'#app',

    data:{
        // 时间
        timer:null,
        //测试循环
        rtimer:null,
        faultCss:"fault-content",
        indicatorText:"indicator-text",
        // new
        newShow:false,
        varNumber:"",
        interval:"",
        // label
        startdrag:false,
        labelShow:false,
        reindex:"",
        //流程图选择
        options: [{
            value: 1,
            label: 'TE过程流程图'
          }, {
            value: 2,
            label: '合成氨过程'
          }, {
            value: 3,
            label: 'FCC（流化催化裂化）过程流程图'
          }, {
            value: 4,
            label: '其他'
          }],
          value: '',
        //流程图选择
        formats: [{
            fvalue: 1,
            label: '.mat'
          }, {
            fvalue: 2,
            label: '.dat'
          }, {
            fvalue: 3,
            label: '其他'
          }],
          formatsel:'',
        // 测点标注
        labelData: [
            // {
            //     data:1
            // }
        ],
         // 小框框数据
        faultData:[
            
        ],

        //describe
        describeShow:false,
        describeDatas: [
            // {
            //     dID:""
                // content:""
            // }
        ],
        // 故障内容
        faultContent:"",
        // 流程图url
        flowChartUrl:"",
        
       
        faultDataIndex:0,
        // 文档
        fileName1:"",
        fileName2:"",
        flowChart:"",
        flowTrain:"",
        //文档内容
        fileContent1:"",
        fileContent2:"",


        arithmetic:[
            "Random Forest", 
            "PCA", 
            "SVM", 
            "BPN",
            "BP",
            "KRR",
            "GMM",
            "LDA",
            "RBF"
        ],

        arithmeticSelect:"",

        indicator:[
            {
                image:"images/指示灯1.png",
                text:"无结果"
            },
            {
                image:"images/指示灯2.png",
                text:"无故障"
            },
            {
                image:"images/指示灯3.png",
                text:"出现故障" 
            }
            
        ],
        // 指示语
        indicatortext:"",
        // 指示号
        indicatorindex: 0,
        //新建对象名称
        objectName:"",
        //时间
        datatimes:0,
        //新建中故障描述
        desprocess:"",
       
        // 是否测试
        isTest:false,
        state:null,
        

    },

    methods:{
        judge(){

            
                if(!(this.varNumber && this.interval && this.desprocess && this.objectName && this.formatsel && this.value)){
                    alert("请将表单填写完整！")

                }else{
                    this.newShow=false
                
                    switch (this.value){
                        case 1:
                            this.flowChartUrl = "images/故障图/1.png"  
                            break;
                        case 2:
                            this.flowChartUrl = "images/故障图/2.png"  
                            break;
                        case 3:
                            this.flowChartUrl = "images/故障图/4.jpg"  
                            break;
                        case 4:
                            this.runHandleAvatarSuccess()
                            break;
                    }
                }                           
                    
    
        },


        //清除新建内容
        Cancel(){
            this.objectName="";
            this.desprocess="";
            this.newShow=false;
            this.fileContent1="";
            this.fileContent2="";
            this.varNumber="";
            this.interval="";
            this.value="";
            this.formatsel="";
        },
        
        labelNew(){
            this.labelData.push({
                lID:"",
            })
        },
       
        labelDelete(index, row) {
          this.labelData.splice (index,1)
          this.faultData.splice(index,1)
        },

        //清除所有小框及其数据
        ClearlabelShow(){
            this.labelData=[]
            this.faultData=[]
            this.labelShow=false
        },

        //新建一条用户自己编写的描述数据
        describeNew(){
            this.describeDatas.push({
                dID:"",
                content:""
            })
        },

            //删除一条用户自己编写的描述数据
        describeDelete(index, row) {
            this.describeDatas.splice (index,1)
            this.reindex=index
            axios.post("http://127.0.0.1:5000/dele",{
                reindex:this.reindex,
            },)
            .then(function(response){
                
                if(response.data.suc>=0){
                    //that.arithmeticSelect=that.arithmetic[response.data.recommend]
                }
                
            },function(err){})
          },

          //清除用户自己编写的描述数据
        ClearDescrible(){
            this.describeDatas=[]
            this.describeShow=false
        },

       //抓取显示数据小框框的位置
        graspPosition(index,e){   
            this.labelShow=false    
            this.startdrag=true
            if(this.faultData[index]==null){
                this.faultData.push(
                    {
                        mdata:"",
                        top:e.clientY+"px",
                        left:e.clientX+"px",
                    }
                )
            }else{
                this.faultData[index].top=e.clientY-233+"px",
                this.faultData[index].left=e.clientX-50+"px"
            }
            faultDataIndex=index
        },
        move(e){
            if(this.startdrag){
                this.faultData[faultDataIndex].top=e.clientY-233+"px",
                this.faultData[faultDataIndex].left=e.clientX-50+"px"
            }
        },

        //智能匹配
        ismatching(){
            if(this.varNumber==""||this.interval==""||this.flowTrain==""){
                alert("请在“新建”中完成对象创建，并填写正确的参数信息！")
            }
            else if(this.describeDatas==""){
                alert("请在“故障设置”中完成设置并上传对应故障数据文件!")
            }
            else{
                this.matching()
            }
        },
        matching(){
            this.state = 3
            that=this
            axios.post("https://hhmnb.top:5000/ainfo",{
                state:that.state, //用于后端判断是训练还是测试 1为训练 2为测试
                fileContent1:that.fileContent1,//训练数据文件地址
                fileContent2:that.fileContent2,//测试数据文件地址
                // arithmetic:this.arithmeticSelect,//算法
                varNumber:that.varNumber,//训练样本数   
                des:that.describeDatas    
            },)
            .then(function(response){
                
                if(response.data.recommend>=0){
                    that.arithmeticSelect=that.arithmetic[response.data.recommend]
                }
                
            },function(err){})
        },

        // 搜索功能
        Search(){
            window.location.href="https://www.hhmnb.top/搜索.docx";
            console.log("press");
        },
        //帮助功能
        help(){
            window.location.href="https://www.hhmnb.top/帮助文档.docx"

        },

        // 指示灯图片获取
        getImage:function(){
            this.indicatortext=this.indicator[this.indicatorindex].text
            return this.indicator[this.indicatorindex].image
        },

        //***************  图片文件获取
        runHandleAvatarSuccess(){

            document.getElementsByTagName("input")[4].click()

        },

        handleAvatarSuccess(res, file) {
            // console.log(res.raw);
            // console.log(URL.createObjectURL(res.raw));
            // console.log(file.URL);
            this.flowChartUrl = URL.createObjectURL(res.raw);

          },
        
        handleAvatarSuccess2() {
            //console.log(res.raw);
            //this.flowTrainUrl = URL.createObjectURL(res.raw);
            this.flowTrain="已上传1个测试样本";

          },

        //********* 清空
        clear(){
        clearInterval(this.timer)
        this.timer=null
        clearInterval(this.rtimer)
        this.rtimer=null
        this.reindex=""
        this.datatimes=0
                // new
        this.newShow=false,
        this.varNumber="",
        this.interval="",
        // label
        this.startdrag=false,
        this.labelShow=false,
        // 测点标注
        this.labelData=[]
         // 小框框数据
         this.faultData=[]

        //describe
        this.describeShow=false,
        this.describeDatas=[]
        // 流程图url
        this.flowChartUrl="",
        this.flowTrainUrl="",
        this.value='',
        this.formatsel='',
        this.faultDataIndex=0,


        this.fileName1="",
        this.fileName2="",

        this.objectName="",
        this.desprocess="",
        this.indicatorindex= 0

        this.arithmeticSelect=""
        //文档内容
        this.fileContent1=""
        this.fileContent2=""
        // 故障内容
        this.faultContent=""
       
       // 是否测试
       this.isTest=true //用于前端判断是训练还是测试
        this.state=1 //用于后端判断是训练还是测试 1为训练 2为测试
        axios.post("http://127.0.0.1:5000/delall",{
                
            },)
            .then(function(response){    
                if(response.data.suc>=0){
                    alert("已全部清除！");    
                }  
            },function(err){})
       
        },

        isDrill(){
          
            if(this.varNumber==""||this.interval==""||this.flowTrain==""){
                alert("请在“新建”中完成对象创建，并填写正确的参数信息！")
            }
            else if(this.arithmeticSelect==""){
                alert("请选择检测算法！")
            }
            else{
                this.Drill()
            }
        },
        updatefile(e){

            this.isTest=false,
            this.state=4;
            that = this;
            
            const loading = this.$loading({
                lock: true,
                text: '正在训练',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.6)'
              });

            myVar=setTimeout(function(){loading.close();alert("训练时间过长，已触发阈值！")},parseInt(that.varNumber)*1000); 
              
            console.log("run");
            let file = e.target.files[0];
            let param = new FormData(); //创建form对象
            param.append('file',file);//通过append向form对象添加数据
            console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
            let config = {
            headers:{'Content-Type':'multipart/form-data'} //这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
            }; //添加请求头
            axios.post('http://127.0.0.1:5000/upload',param,config)
            .then(function(response){
                loading.close();
                
                 if(response.data.tr==1){//但前端每次执行都会刷新初始值，因此该判断失效
                    that.isTest=true
                    //that.state=4
                    that.arithmeticSelect=that.arithmetic[response.data.recommend]
                    alert("模型选择成功！")
                 }

            },function(err){})    
            
        },
        //*****************训练上传文档内容
        Drill(){
            //console.log("length"+this.labelData.length)
            this.isTest=false,
            this.state=1;
            that = this;
            const loading = this.$loading({
                lock: true,
                text: '正在训练',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.6)'
              });
              
            myVar=setTimeout(function(){loading.close();alert("训练时间过长，已触发阈值！")},parseInt(that.varNumber)*1000);  
            console.log("run");
            axios.post("https://hhmnb.top:5000/ainfo",{
                state:that.state, //用于后端判断是训练还是测试 1为训练 2为测试
                fileContent1:that.fileContent1,//训练数据文件地址
                fileContent2:that.fileContent2,//测试数据文件地址
                arithmetic:that.arithmeticSelect,//算法
                varNumber:that.varNumber,//训练样本数
                des:that.describeDatas
            },)
            .then(function(response){
                loading.close();
                 
                 if(response.data.tr==1){//但前端每次执行都会刷新初始值，因此该判断失效
                    that.isTest=true
                    that.state=2
                    alert("模型已训练完毕！")
                    clearTimeout(myVar);
                 }

            },function(err){})    
            
        },

        isTesto(){
            if(this.varNumber==""||this.interval==""||this.flowTrain==""){
                alert("请在“新建”中完成对象创建，并填写正确的参数信息！")
            }
            else if(this.arithmeticSelect==""){
                alert("请选择算法并生成相应模型！")
            }
            else if(this.isTest){
                this.Testo()
            }
            else{
                alert("测试失败！")
            }
        },

        //测试
        Testo(){
            //console.log("length"+this.labelData.length)
            console.log(this.state);
            if(this.isTest){//每次运行时，isTest都会恢复初始值，不知如何解决
                var rinterval=this.interval*1000
                
                var num=1;
                this.state=2;
                const loading = this.$loading({
                    lock: true,
                    text: '正在准备测试',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.6)'
                  });
                  
                myVar=setTimeout(function(){loading.close()},500); 
                var that = this;
                this.rtimer = window.setInterval(() => {
                    num++;
                    //console.log(num);
                    axios.post("https://hhmnb.top:5000/ainfo",{
                            state:that.state, //用于后端判断是训练还是测试 1为训练 2为测试
                            fileContent1:that.fileContent1,//训练数据文件地址
                            fileContent2:that.fileContent2,//测试数据文件地址
                            arithmetic:that.arithmeticSelect,//算法
                            varNumber:that.varNumber,//训练样本数
                            num:num,//测试第几排
                            des:that.describeDatas,
                            form:that.formatsel
                        },)
                        .then(function(response){
                            if(response.data.error==1){
                                alert("测试样本与模型不匹配！\n具体错误信息："+response.data.info);
                                
                            }
                            if(response.data.end==1){
                                alert("反应全程无故障结束，感谢您的使用！");
                            }
                            console.log(response); 
                            that.indicatorindex=1
                            
                            if(that.labelData!=null){
                                //console.log("length"+this.labelData.length)
                            for(var i=0;i<that.labelData.length;i++){
                                console.log(that.labelData[i].lID); 
                                //if(parseInt(that.labelData[i].lID)==i){
                                    that.faultData[i].mdata=response.data.data[parseInt(that.labelData[i].lID)]
                                //}
                             };
                            }

                            console.log(that.faultData)
                            if(response.data.judge[0]!=0&&response.data.judge[0]!=null){
                                that.indicatorindex=2
                                clearInterval(that.rtimer)
                                that.rtimer=null
                                clearInterval(that.timer)
                                that.timer=null
                                alert("算法检测到故障，停止测试样本！")
                                that.describeDatas.forEach(item => {
                                    if(item.dID==response.data.judge[0]){
                                        that.faultContent = item.content
                                        
                                    }
                                });
                                // faultContent=this.describeDatas[][response.data.judge[0]]//返回的错误编号，使之对应显示在前端界面上
                            }
                            

                    },function(err){})
                    if(that.isTest){
                        clearInterval(that.rtimer)
                        that.rtimer=null
                    }
                }, rinterval);

                clearTimeout(this.timer)
                this.datatimes=0
                this.timer = window.setInterval(() => {
                    this.datatimes++;
                }, 1000);
            }
            
        }

    },
    
})

function judgeColor (indicatorindex) {
    console.log(app);
    console.log(app._data)
    if(indicatorindex== 2){
        app._data.faultCss="fault-content changered",
        app._data.indicatorText="indicator-text changered"
    }else{
        app._data.faultCss="fault-content",
        app._data.indicatorText="indicator-text"
    }
    console.log("好了")
}
