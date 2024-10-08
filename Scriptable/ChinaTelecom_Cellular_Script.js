// 本脚本来源互联网大佬编写，仅作微调以供自用。将默认显示已用流量调整为剩余流量
// 原文链接：https://github.com/ChinaTelecomOperators/ChinaTelecom
// 原文频道：https://t.me/CatStudyCase

const w = new ListWidget()
const DynamicText = Color.dynamic(new Color('#111111'), new Color('#ffffff'))
w.backgroundColor = Color.dynamic(new Color('#ffffff'), new Color('#1c1c1e'))

const bgColor = new Color("c3c3c3")
const limitColor = new Color("#fe5776")
const unlimitColor = new Color("#4caf50")

async function Run(){
  let Wsize=-1
  if(!getdata('LimitVal')) setdata('LimitVal', '')
  if(!getdata('unLimitVal')) setdata('unLimitVal', '')

  if (config.runsInApp) {
    let al = new Alert()
    al.title = '余量信息'
    al.message = '请在相关设置选择数据来源'
    al.addAction('更新脚本') //0
    al.addAction('相关设置') //1
    al.addAction('预览组件') //2
    al.addAction('刷新桌面小组件') //3
    al.addCancelAction('取消') //-1


    let UserCh = await al.presentSheet()
    if (UserCh == -1) {}
    if (UserCh == 0) {
      await AsyncJs()
      let al = new Alert()
      al.message = '更新脚本完成，退出后生效'
      al.addAction('完成')
      await al.present()
    }
    if (UserCh == 1) {//相关设置
      let a1 = new Alert()
      a1.title = '相关设置'
      a1.message='间距与数据相关设置'
      a1.addAction('数据来源')
      a1.addAction('自定义余量')
      a1.addAction('组件间距设置')
      a1.addDestructiveAction('清除缓存')
      a1.addCancelAction('取消')
      let ch=await a1.presentAlert()
      if(ch==0){//数据来源
        let a2=new Alert()
        a2.title = '数据来源'
        a2.addAction('从BoxJS获取-电信')
        a2.addAction('从BoxJS获取-联通')
        a2.addCancelAction('取消')
        let ch=await a2.presentAlert()
        if(ch==-1) {}
        if(ch==0) {
          setdata('isData', '1')
          Wsize=1
        }
        if(ch==1) {
          setdata('isData', '2')
          Wsize=1
        }

      }
      if(ch==1){//通用与定向数据自定义
        let a2=new Alert()
        a2.message=`通用与定向数据自定义\n不填写为默认空\n单位GB`
        a2.addTextField('通用总量',getdata('LimitVal')||'')
        a2.addTextField('定向总量',getdata('unLimitVal')||'')
        a2.addAction('确认')
        a2.addCancelAction('取消')
        await a2.presentAlert()
        let val=a2.textFieldValue(0)
        let val1=a2.textFieldValue(1)
        setdata('LimitVal', String(val))
        setdata('unLimitVal', String(val1))

      }
      if(ch==2){//组件间距设置
	    let a2=new Alert() 
	    a2.title='组件间距设置'
	    a2.message=`柱状图单次减少量为0.1`
	    a2.addTextField('组件间隔 默认值20' , getdata('Space')||'')
	    a2.addTextField('柱状图间隔 默认值2', getdata('KSize')||'')
      a2.addTextField('左边距 默认值5', getdata('Left_Padding')||'')
      a2.addDestructiveAction('全部恢复默认值')
	    a2.addAction('确认')
	    a2.addCancelAction('取消')
        let ch = await a2.presentAlert()
        if(ch==0){
          rmdata('Space');
          rmdata('KSize');
          rmdata('Left_Padding');
        }else if(ch == 1){
          let Space = a2.textFieldValue(0)
          let KSize = a2.textFieldValue(1)
          let Left_Padding = a2.textFieldValue(2)
          setdata('Space', String(Space))
          setdata('KSize', String(KSize))
          setdata('Left_Padding', String(Left_Padding))
          Wsize = 1
        }

      }
      if(ch==3){
	    let a2=new Alert() 
	    a2.message=`清除上版本缓存，当组件存在问题时可清理`
         a2.addAction('确认')
         a2.addCancelAction('取消')
        let ch=await a2.presentAlert()
        if(ch==0){ClearData()}
      }
    }
    if (UserCh == 2) {//预览类型
      let a1 = new Alert()
      a1.title = '预览类型'
      a1.addAction('小组件')
      a1.addAction('中等组件')
      a1.addCancelAction('取消')
      Wsize = await a1.presentAlert()
    }
    if(UserCh==3){
      let al = new Alert()
      al.message = '刷新完成'
      al.addAction('完成')
      await al.present()
    }
  }

  let str='数据流量-通用'
  let str1 ='数据流量-定向'
  Query=await BoxJsData()

  processData(Query)

  if (config.widgetFamily == 'small' || Wsize == 0) {
    generateSmallWidget(str ,str1, w ,Query)
    if (Wsize == 0) { w.presentSmall() }
  }
  if (config.widgetFamily == 'medium' || Wsize == 1) {

    const rowSpacing = 5; // 设置行间距
    const leftPadding = Number(getdata('Left_Padding'))|| 5; // 设置左边距
    const LimtUnlimitPadding=  Number(getdata('Space'))|| 45; //设置第一行通用与定向间距

    generateMediumWidget(Query ,str ,str1 ,w ,rowSpacing ,leftPadding ,LimtUnlimitPadding)
    if (Wsize == 1) { w.presentMedium() }
  }

}

await Run()
Script.setWidget(w)
Script.complete()  

function ClearData(){
  for(i=0;i<48;++i)rmdata(String(i))
  rmdata('LimitVal')
  rmdata('unLimitVal')
  rmdata('Space')
  rmdata('KSize')
  rmdata('Left_Padding')
  rmdata('Hours')
}

async function AsyncJs(){
  let fm = FileManager.local();
  if (fm.isFileStoredIniCloud(module.filename)) {
    fm = FileManager.iCloud();
  }
  const url = 'https://raw.githubusercontent.com/QiXiuYuano/Profiles/main/Scriptable/ChinaTelecom_Cellular_Script.js';
  const request = new Request(url);
  try {
    const code = await request.loadString();
    fm.writeString(module.filename, code);
    const alert = new Alert();
    alert.message = '代码已更新,关闭生效。';
    // alert.addAction('确定');
    // alert.presentAlert();
  } catch (e) {
    console.error(e);
  }
}

function processData(Query) {
  let Hours = new Date().getHours(); //获取小时	
  if (!getdata('Hours')) setdata('Hours', String(Hours));
  LastTime = Hours == 0 ?  47 : Hours + 24 - 1;

  for (Hours == 0 ? i = 1 : i = 0; i <= 23 && (!getdata(String(i)) || Hours == 0); i++) { //数据初始化
    let First = { unlimitchange: 0, limitchange: 0 };
    setdata(String(i), JSON.stringify(First));
  }
  for (i = 24; i <= 47 && !getdata(String(i)); i++) { //数据初始化	
    let First = { UNLimitLeft: 0, LimitLeft: 0 };
    setdata(String(i), JSON.stringify(First));
  }

  if (getdata('Hours') != String(Hours)) {
    setdata('Hours', String(Hours));
    let Usage={
      LimitLeft : Query.LimitLeft,
      UNLimitLeft : Query.UNLimitLeft
    }
    setdata(String(Hours + 24), JSON.stringify(Usage)); //将就数据存入24-47中	
  }

  let LastLimit = getobjdata(String(LastTime)).LimitLeft;
  let LastUnlimit = getobjdata(String(LastTime)).UNLimitLeft;
  let Change = {
    unlimitchange: Query.UNLimitLeft - LastUnlimit,
    limitchange: Query.LimitLeft - LastLimit
  };
  setdata(String(Hours), JSON.stringify(Change)); //将变化量存入0~23中
}

function generateSmallWidget(str ,str1, Widget ,Query){
  const container = Widget.addStack();
  container.layoutVertically();
  container.centerAlignContent();

  const upStack = container.addStack();
  generateModule(upStack,str,Query.LimitLeft, Query.LimitAll, bgColor, limitColor)
  container.addSpacer(10);
  const downStack = container.addStack();
  generateModule(downStack,str1,Query.UNLimitLeft, Query.UNLimitAll, bgColor, unlimitColor)
}

function generateMediumWidget(Query ,str ,str1 ,Widget ,rowSpacing ,leftPadding ,LimtUnlimitPadding){
  
  let column = Widget.addStack()
  column.layoutVertically()


  let row =column.addStack();
  row.addSpacer(leftPadding+10)

  column.addSpacer(rowSpacing); // 在 row2 添加垂直间距

  let row2 = column.addStack()
  row2.addSpacer(leftPadding)

  column.addSpacer(rowSpacing); // 在 row3 添加垂直间距

  let row3 = column.addStack()
  row3.addSpacer(leftPadding)

  const container = row.addStack();
  container.layoutHorizontally();
  container.centerAlignContent();

  const leftStack = container.addStack();
  generateModule(leftStack,str,Query.LimitLeft, Query.LimitAll, bgColor, limitColor)

  container.addSpacer(LimtUnlimitPadding);

  const rightStack = container.addStack();
  generateModule(rightStack,str1,Query.UNLimitLeft, Query.UNLimitAll, bgColor, unlimitColor)


  const canvasWidth = 10;
  const canvasHeight = 40;

  for (let i = 0; i <= 23; i++) {
    let columnImgStack = row3.addStack()
    columnImgStack.layoutVertically()
    const iconImg = columnImgStack.addImage(HourKline(getobjdata(String(i)).limitchange, getobjdata(String(i)).unlimitchange, i,canvasWidth ,canvasHeight, limitColor, unlimitColor))
    iconImg.imageSize = new Size(canvasWidth, canvasHeight);
    // 在指定时间下方绘制时间数字
    if (i === 0 || i === 6 || i === 12 || i === 18 || i === 23) {
      let timeText=columnImgStack.addText(i.toString().padStart(2, '0'))
      timeText.font = Font.mediumSystemFont(9)
      timeText.textColor= DynamicText
    }
    row3.addSpacer(Number(getdata('KSize'))||2);
  }


}

function generateModule(Widget,str,usage, total, bgColor, usageColor) {

  Widget.setPadding(0, 0, 0, 0);

  const column = Widget.addStack()
  column.layoutVertically()

  let titleRow= column.addStack()
  titleRow.layoutHorizontally()
  let title = titleRow.addText(str)
  title.textColor = DynamicText
  title.font = Font.boldSystemFont(9)

  column.addSpacer(2)

  let valRow = column.addStack()
  // valRow.layoutHorizontally()
  const iconImg = valRow.addImage(UsageBar(usage, total, bgColor, usageColor))
  iconImg.imageSize = new Size(7, 42)
  valRow.addSpacer(5)//图片与文字距离
  let valRowLine = valRow.addStack()
  valRowLine.layoutVertically()
  const usageText = valRowLine.addText(String(ToSize(usage, 1, 1, 1)))
  const totalText = valRowLine.addText(total==0? '无限 ':String(ToSize(total, 1, 0, 1)) + '(' + (usage / total * 100).toFixed(0) + '%)')
  usageText.font = Font.mediumMonospacedSystemFont(20)
  totalText.font = Font.mediumRoundedSystemFont(15)
  usageText.textColor = DynamicText
  totalText.textColor = DynamicText

}

/**
 * 
 * @param {*} total 总量
 * @param {*} haveGone 使用量
 * @returns 
 */
function UsageBar(haveGone, total, bgColor, usageColor) {
  const canvasWidth = 7;
  const canvasHeight = 40;
  const barCornerRadius = {x: 8 ,y: 2 };

  // 创建DrawContext实例，并设置画布大小
  const context = new DrawContext();
  context.size = new Size(canvasWidth, canvasHeight)//画布宽高
  context.respectScreenScale = true;
  context.opaque = false; // 设置为透明背景

  // 创建柱状图剩余路径
  const bgPath = new Path();
  bgPath.addRoundedRect(new Rect(0, 0, canvasWidth, canvasHeight), barCornerRadius.x, barCornerRadius.y);
  context.addPath(bgPath);
  context.setFillColor(bgColor);
  context.fillPath();

  // 创建柱状图用量路径
  const barPath = new Path();
  const barHeight = (haveGone / total) * canvasHeight;
  const barRect = new Rect(0, canvasHeight - barHeight , canvasWidth, barHeight);
  barPath.addRoundedRect(barRect, barCornerRadius.x, barCornerRadius.y);
  context.addPath(barPath);
  context.setFillColor(usageColor); // 填充蓝色
  context.fillPath();

  const Image = context.getImage(); // 获取绘制的图像

  return Image;
}

/**
 * 
 * @param {*} limit 通用用量
 * @param {*} unlimit 定向用量
 * @param {*} t 时间
 * @returns image
 */
function HourKline(limit, unlimit, t ,width ,height, limitColor, unlimitColor) {

  let All = limit + unlimit
  ThereShold = 5242880;
  if (All >= 0 && All <= 1048576) ThereShold = 1048576//1GB
  if (All > 1048576 && All <= 5242880) ThereShold = 5242880//5GB
  if (All > 5242880 && All <= 10485760) ThereShold = 10485760//10GB
  if (All > 10485760 && All <= 20971520) ThereShold = 20971520//20GB
  if (All > 20971520 && All <= 52428800) ThereShold = 52428800//50GB
  if (All > 52428800) ThereShold = 1048576000//100GB

  const context = new DrawContext()//创建图形画布
  context.opaque = false; // 设置为透明背景
  context.size = new Size(width, height)
  context.respectScreenScale = true

  if (t == 0 || t == 6 || t == 12 || t == 18 || t == 23) Width = 0.4
  else Width = 0.1

  const bgColor = new Color("#4d4d4d"); // 线条为浅灰色
  // 创建柱状图线条
  const bgPath = new Path();
  bgPath.addRoundedRect(new Rect(width / 2, 0, Width, height), 0, 0);
  context.addPath(bgPath);
  context.setFillColor(bgColor);
  context.fillPath();


  // 创建柱状图用量路径
  const barPath = new Path();
  const limitbarHeight = height * limit / ThereShold
  const unlimitbarHeight = height * unlimit / ThereShold

  const barlimitRect = new Rect(0, height - limitbarHeight-unlimitbarHeight, width, limitbarHeight);
  const barunlimitRect = new Rect(0, height- unlimitbarHeight, width, unlimitbarHeight);
  barPath.addRoundedRect(barlimitRect, 0, 0);
  barPath.addRoundedRect(barunlimitRect, 0, 0);

  // 设置不同的填充颜色
  context.setFillColor(limitColor); // 设置limit部分的填充颜色
  context.fill(barlimitRect);

  context.setFillColor(unlimitColor); // 设置unlimit部分的填充颜色
  context.fill(barunlimitRect);

  return context.getImage()
}

function ToSize(kbyte, s, l, t) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let size = kbyte * 1024; // 将输入的千字节转换为字节

  // 计算单位的指数
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // 格式化大小字符串
  let formattedSize = size.toFixed(s);
  if (l > 0) {
    formattedSize = formattedSize.padEnd(formattedSize.length + l, ' ');
  }

  // 添加单位
  if (t === 1) {
    formattedSize += units[unitIndex];
  }

  return formattedSize;
}


async function BoxJsData() {
  console.log('BoxJS获取数据')
  let url
   if(getdata('isData')== '1'){
      url = 'http://boxjs.com/query/data/PackgeDetail'
   }
    if(getdata('isData')=='2'){
      url = 'http://boxjs.com/query/data/@ChinaUnicom.10010v4.vars'
    }
  console.log(url)

  let data = null
  try {
    let SetVal = Number(getdata('LimitVal'))
    let SetVal1 = Number(getdata('unLimitVal'))

    let req = new Request(url)
    data = await (req.loadJSON())
    if(SetVal != '') SetVal *= 1048576
    if(SetVal1 != '') SetVal1 *=1048579

    if(getdata('isData')=='1'){

      ArrayQuery = JSON.parse(data.val)

      BillLeft = ArrayQuery.balanceInfo.balance||null,//[话剩]
      BillUsed = ArrayQuery.balanceInfo.used || null,//[话用]
      AllLimitUse = ArrayQuery.flowInfo.commonFlow.used,// '[通用]'
      AllLimitLeft = ArrayQuery.flowInfo.commonFlow.balance,// '[通剩]'
      AllLimit =  SetVal|| ArrayQuery.flowInfo.commonFlow.total ,// '[通总]'
      AllUnlimitUse = ArrayQuery.flowInfo.specialAmount.used,// '[定用]'
      AllUnlimitLeft = ArrayQuery.flowInfo.specialAmount.balance,// '[定剩]'
      AllUnlimit =  SetVal1|| ArrayQuery.flowInfo.specialAmount.total,// '[定总]'
      AllVoiceUsed = ArrayQuery.voiceInfo.used || null,//[语用]
      AllVoiceLeft = ArrayQuery.voiceInfo.balance|| null//[语剩]


    }    
    if(getdata('isData')=='2'){
      rawData=JSON.parse(data.val)

      AllVoiceUsed = ''
      AllVoiceLeft = ''
      BillUsed = ''
      BillLeft = ''
      AllUnlimitUse=(rawData['[所有免流.已用].raw'])*1024
      AllUnlimitLeft= (rawData['[所有免流.剩余].raw'])*1024
      AllUnlimit =SetVal1 || rawData['[所有免流.总].raw'] *1024

  
      AllLimitUse=(rawData['[所有通用.已用].raw'])*1024
      AllLimitLeft=(rawData['[所有通用.剩余].raw'])*1024
      AllLimit= SetVal || rawData['[所有通用.总].raw'] *1024

      console.log(AllLimit+' '+AllLimitLeft+' '+AllLimitUse+`\n`+AllUnlimit+' '+AllUnlimitLeft+' '+AllUnlimitUse);
      
    }
  } catch (e) { 
    console.error(e);
  }
  
  let Queryinfo = { 
    UNLimitAll: AllUnlimit,         // 定向总量
    UNLimitLeft: AllUnlimitLeft,    // 定向剩余
    UNLimitUsage: AllUnlimitUse,    // 定向已用

    LimitAll: AllLimit,             // 通用总量
    LimitLeft: AllLimitLeft,        // 通用剩余
    LimitUsage: AllLimitUse ,       // 通用已用

    VoiceBill: {used:AllVoiceUsed,left:AllVoiceLeft},
    VoiceDataBill: {used:BillUsed,left:BillLeft}
  }

  console.log(Queryinfo);

  return Queryinfo
}

async function getImage(url) {
  const request = new Request(url);
  const image = await request.loadImage();
  return image
}

function setdata(Key, Val) {Keychain.set(Key, Val);}
function getdata(Key) {
  if(Keychain.contains(Key))return Keychain.get(Key) 
  else return false
}
function getobjdata(Key) { return JSON.parse(Keychain.get(Key)) }
function rmdata(Key) { Keychain.remove(Key)}
