// AJAX撈資料
const xhr =new XMLHttpRequest()
const jsonURL='https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c'
xhr.open('get',jsonURL,false)
xhr.send(null)
const jsonData =JSON.parse(xhr.responseText)
const allData =jsonData.data.XML_Head.Infos.Info

// 將本來allData裡屬性Zone的值(原本是空值)，更改為data.Add地址中篩選出來的行政區字元
const Len =allData.length;
for(let i=0;Len>i;i++){
    let zoneSting=allData[i].Add.match(/\W+區/)[0]
    let top3String=zoneSting.substr(0,3)
    allData[i].Zone=top3String
}

// 設定DOM
const Select=document.getElementById('choose');
const UL=document.querySelector('.content');
const Page=document.querySelector('.page')
const districtH3=document.querySelector('.districtTitle');
const hotBox=document.querySelector('.hotDsrct')
const btn=document.querySelector('.goTop')
//和轉跳頁面有關的變數
let temporaryData=[]    /*callHotspot()和changeSelect()暫時push上來的資料，讓renderList()去渲染*/
let currentPage =1
let currentPageData=[]
let perPage =16
let showPage =10

allData.forEach(function(data){
    temporaryData.push(data)
})

renderSelector()
displayData()
renderList(currentPageData);
renderPageList(temporaryData)
// 事件
Select.addEventListener('change',changeSelect);
hotBox.addEventListener('click',callHotspot);
Page.addEventListener('click',changePage)
window.addEventListener('scroll',btnShow);
btn.addEventListener('click',goTop);

function renderList(Arry){
    let str=''
    Arry.forEach(function(data){
        if(data.Ticketinfo=='' || data.Ticketinfo=='免費參觀'){
            str+=`<li class="spots">
                <div class="img" style="background-image:url(${data.Picture1})">
                    <div class="wrap">
                        <h5 class="spotName">${data.Name}</h5>
                        <span class="district">${data.Zone}</span>
                    </div>
                </div>
                <div class="info">
                    <div>
                        <img src="img/icons_clock.png" alt="">
                        <p class="time">${data.Opentime}</p>
                    </div>
                    <div>
                        <img src="img/icons_pin.png" alt="">
                        <p class="add">${data.Add}</p>
                    </div>
                    <div>
                        <img src="img/icons_phone.png" alt="">
                        <p class="tel">${data.Tel}</p>
                    </div>
                </div>
            </li>`
            //如果Ticketinfo沒有值或是免費參觀，Tag則不用顯示出來
        }else{
            str+=`<li class="spots">
                <div class="img" style="background-image:url(${data.Picture1})">
                    <div class="wrap">
                        <h5 class="spotName">${data.Name}</h5>
                        <span class="district">${data.Zone}</span>
                    </div>
                </div>
                <div class="info">
                    <div>
                        <img src="img/icons_clock.png" alt="">
                        <p class="time">${data.Opentime}</p>
                    </div>
                    <div>
                        <img src="img/icons_pin.png" alt="">
                        <p class="add">${data.Add}</p>
                    </div>
                    <div>
                        <img src="img/icons_phone.png" alt="">
                        <p class="tel">${data.Tel}</p>
                    </div>
                    <div class="tag">
                        <img src="img/icons_tag.png" alt="">
                        <p class="ticket">${data.Ticketinfo}</p>
                    </div>
                </div>
            </li>`
        }
    })
    UL.innerHTML=str
    }

// 將JSON裡行政區名稱渲染到下拉選單
function renderSelector(){
    let districtList= []
    for(let i=0;Len>i;i++){
        districtList.push(allData[i].Zone);
      }
    // console.log(districtList)
    let Zone= ['全部景點']
    districtList.forEach(function(value){
        if(Zone.indexOf(value)==-1){
            Zone.push(value)
        }
    })
    // console.log(Zone)
    let str=''
    for(let i=0;Zone.length>i;i++){
        str+=`<option value="${Zone[i]}">${Zone[i]}</option>`
    }
    // console.log(str)
    Select.innerHTML=str
}

// 點熱門行政區
function callHotspot(e){
    let dataZone =e.target.dataset.zone;
    let nodeName=e.target.nodeName;
    if(nodeName=='A'){
        districtH3.innerHTML=dataZone;
        Select.value=dataZone;
        temporaryData.splice(0,1000)
        allData.forEach(function(data){
            if(dataZone==data.Zone){
                temporaryData.push(data)
            }
        })  /*forEach迴圈將符合的行政區push到陣列temporaryData*/
    currentPage =1
    displayData()
    renderPageList(temporaryData)
    renderList(currentPageData)
    }
}

// 變更下拉式選單的內容
function changeSelect (e){
    let slcValue=e.target.value;
    districtH3.innerHTML=slcValue;
    temporaryData.splice(0,1000)
    allData.forEach(function(data){
        if(slcValue==data.Zone){
            temporaryData.push(data)
        }
    })  /*forEach迴圈將符合的行政區push到陣列temporaryData*/
    if(slcValue=="全部景點"){
        allData.forEach(function(data){
            temporaryData.push(data)
        })
    }
    currentPage =1
    displayData()
    renderPageList(temporaryData)//頁面每換一次資料，頁數也要跟著換
    renderList(currentPageData)
}

function renderPageList(data){
    let DataLen =data.length
    let pageTotal =Math.ceil(DataLen/perPage)/*總頁數=(資料數/每頁筆數)無條件進位*/
    let str=''
    let pre='<li class="previous" data-page="pre">Previous</li>'
    let nxt='<li class="next" data-page="nxt">Next</li>'
    //總共有幾頁就渲染到網頁
    if(pageTotal>showPage){     //總頁數超過10頁，就先呈現前10頁
        for(let i=1;i<=showPage;i++){
            str+=`<li data-page="${i}" class="">${i}</li>`
        }
        Page.innerHTML=`${pre}<li data-page="pre10"><<</li>${str}<li data-page="nxt10">>></li>${nxt}`
        activePage()
    }else if(pageTotal<=showPage && pageTotal>1){
        for(let i=1;i<=pageTotal;i++){
            str+=`<li data-page="${i}" class="">${i}</li>`
        }
        Page.innerHTML=`${pre}${str}${nxt}`
        activePage()
    }else if(pageTotal=1){
        Page.innerHTML=''
    }
    
}

// 轉跳上下10頁
function renderTenPage(e){
    let nodeName=e.target.nodeName;
    let datasetPage= e.target.dataset.page
    let DataLen =temporaryData.length
    let pageTotal =Math.ceil(DataLen/perPage)
    let crntPgRnDn=Math.floor(currentPage/10)*10
    if(nodeName=='LI'){
        let str=''
        let pre='<li class="previous" data-page="pre">Previous</li>'
        let nxt='<li class="next" data-page="nxt">Next</li>'
        if(datasetPage=='pre'){
            for(let i=(currentPage-showPage);i<=(currentPage-1);i++){
                 str+=`<li data-page="${i}" class="">${i}</li>`
            }
        }else if(datasetPage=='nxt'){
            if(currentPage<(Math.floor(pageTotal/10)*10)){
                console.log('10page')
                for(let i=currentPage+1;i<=currentPage+showPage;i++){
                    str+=`<li data-page="${i}" class="">${i}</li>`
                }
            }else{
                console.log('31-33')
            }
        }else if(datasetPage=='pre10' && currentPage>showPage){
            for(let i=(crntPgRnDn-9);i<=crntPgRnDn;i++){
                str+=`<li data-page="${i}" class="">${i}</li>`
            }
            currentPage=Math.floor((currentPage-1)/10)*10
        }else if(datasetPage=='nxt10'){
            console.log('10page')
            if(currentPage>(Math.floor(pageTotal/10)*10)-showPage){
                console.log('30-33')
                for(let i=Math.floor(pageTotal/10)*10+1;i<=pageTotal;i++){
                    str+=`<li data-page="${i}" class="">${i}</li>`
                }
            }else{
                console.log('10page')
                for(let i=Math.floor((currentPage-1)/10)*10+11;i<=Math.floor((currentPage-1)/10)*10+20;i++){
                    str+=`<li data-page="${i}" class="">${i}</li>`
                }
            }
            currentPage=Math.floor((currentPage-1)/10)*10+11
        }else{
            return
        }
        Page.innerHTML=`${pre}<li data-page="pre10"><<</li>${str}<li data-page="nxt10">>></li>${nxt}`
    }
}

//從temporaryData抓16筆資料push到currentPageData
function displayData(){
    currentPageData.splice(0,100)
    // console.log(currentPage)
    // console.log(currentPageData)
    let minData =(currentPage-1)*perPage  
    let maxData =currentPage*perPage-1  /*每頁的最小筆和最大筆資料，EX:第2頁為第11~20筆。因為第一筆是0所以都-1*/
    let DataLen =temporaryData.length
    let pageTotal =Math.ceil(DataLen/perPage)
    //因為最後一頁沒有滿16筆資料，所以currentPageData後面的資料都是undefined，renderList()沒辦法辨識
    //所以假設currentPage=pageTotal，i的最大值要是temporaryData.length
    if(currentPage==pageTotal){
        for(let i=minData;i<DataLen;i++){
            currentPageData.push(temporaryData[i])
        }
    }else{
        for(let i=minData;i<=maxData;i++){
            currentPageData.push(temporaryData[i])
        }
    }
    // console.log(currentPageData)
}

//點擊頁數，一律從temporaryData抓當前頁面的筆數push到currtentPageData[]
//再renderList(currtentPageData)
//所以allData是原始資料不能被刪，在一開始就把allData全部push到temporaryData(29)
function changePage(e){
    let activeLI=document.querySelector(`[data-page="${currentPage}"]`)
    activeLI.classList.remove('active')
    let nodeName=e.target.nodeName;
    let datasetPage= e.target.dataset.page
    let DataLen =temporaryData.length
    let pageTotal =Math.ceil(DataLen/perPage)
    if(nodeName=='LI'){
        let pre='<li class="previous" data-page="pre">Previous</li>'
        let nxt='<li class="next" data-page="nxt">Next</li>'
        // console.log(currentPage)
        //點pre或nxt，currentPae+1-1
        if(Number(datasetPage)>0){
            currentPage =parseInt(datasetPage)
            goTop()
        }else if(datasetPage=='pre'){
            if(currentPage==1){
                activePage()
                return
            }else if((currentPage%10)===1){
                renderTenPage(e)
            }
            currentPage = currentPage-1
            goTop()
        }else if(datasetPage=='nxt'){
            if(currentPage==pageTotal){
                activePage()
                return
            }else if((currentPage%10)===0){
                renderTenPage(e)
            }
            currentPage=currentPage+1
            goTop()
        }else if(datasetPage=='pre10'){
            renderTenPage(e)
            
        }else if(datasetPage=='nxt10'){
            if(currentPage==pageTotal){
                activePage()
                return
            }else{
                renderTenPage(e)
            }
        }
    }
    displayData()
    renderList(currentPageData)
    activePage()
}
//目前是哪一頁，就在那一頁嵌入class=".active"
function activePage(){
    let activeLI=document.querySelector(`[data-page="${currentPage}"]`)
    activeLI.classList.add('active')
}
//點擊頁面箭頭看更多頁面數

function btnShow(){
    if(window.scrollY>=980){
        btn.setAttribute('style','opacity:1;transform:translateX(0px)')
    }else if(window.scrollY<980){
        btn.setAttribute('style','opacity:0;transform:translateX(10px')
    }
}
function goTop(){
    window.scrollTo({
        top:300,
        behavior:"smooth"
    });
}