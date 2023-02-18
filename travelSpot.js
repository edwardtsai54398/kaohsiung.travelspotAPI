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
let str=''
let temporaryData=[]
// 事件
renderSelector()
renderList(allData);
Select.addEventListener('change',changeSelect);
// hotBox.addEventListener('click',callHotspot);
window.addEventListener('scroll',btnShow);
btn.addEventListener('click',goTop);

function renderList(Arry){
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


// function callHotspot(e){
//     let dataZone =e.target.dataset.zone;
//     let temporaryData=[]
//     let nodeName=e.target.nodeName;
//     if(nodeName=='A'){
//         districtH3.innerHTML=dataZone;
//         Select.value=dataZone;
//         data.forEach(function(data){
//             if(dataZone==data.Zone){
//                 console.log(data)
//                 temporaryData.push(data)
//             }
//         })
//     console.log(temporaryData)
//     renderList(temporaryData)
//     }
// }
function changeSelect (e){
    let slcValue=e.target.value;
    let str ='';
    districtH3.innerHTML=slcValue;
    let selectedDataArry=[]
    temporaryData.splice(0,1000)
    console.log(temporaryData)
    allData.forEach(function(data){
        if(slcValue==data.Zone){
            temporaryData.push(data)
        }
    })
    console.log(temporaryData)
    renderList(temporaryData)
}
function btnShow(){
    if(window.scrollY>=980){
        btn.setAttribute('style','opacity:1;transform:translateX(0px)')
    }else if(window.scrollY<980){
        btn.setAttribute('style','opacity:0;transform:translateX(10px')
    }
}
function goTop(){
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}