# 高雄景點Open Data串接
使用高雄市政府開放資料，迅速查看各區的主要旅遊景點資訊。<br>
[展示頁面 Display Page](https://edwardtsai54398.github.io/kaohsiung.travelspotAPI/)

---
## 使用技術
* 原生JS 語法
* .match 搭配正規表達式抓出地址字串中的行政區
* AJAX 技術導入json 連結
## 功能介紹
### * 顯示串接高雄開放資料的旅遊相關資訊，用圖卡列出相關資訊。

### * 選單可直接選取想要查詢的行政區查詢資料。
<img width="800" alt="截圖 2023-03-12 上午9 47 08" src="https://user-images.githubusercontent.com/118988159/224523794-e06b9ac9-1383-483c-97d1-a85409f3a136.png">

### * 使用熱門行政區按鈕，可查詢該行政區，且上方選單會一併轉跳。
<img width="800" alt="截圖 2023-03-12 上午9 48 01" src="https://user-images.githubusercontent.com/118988159/224523831-882b66b4-b088-4e50-9cfd-991b00be902a.png">

### * scroll bar 下滑到一定的位置，右下角會顯現"回到上方"的按鈕。
<img width="500" alt="截圖 2023-03-12 上午9 48 53" src="https://user-images.githubusercontent.com/118988159/224523841-06371d54-e215-466c-a0fc-7c07f7d56e93.png">

### * 分頁功能
<img width="800" alt="截圖 2023-03-12 上午9 49 25" src="https://user-images.githubusercontent.com/118988159/224523847-c4bf871a-bd1e-4817-9ab0-2ca7c5517006.png">

## 程式撰寫邏輯
```mermaid
flowchart TB
    A[(Open Data json 檔)] -->|AJAX| B((allData))
    B ------>|全部push| E((temporaryData<br>該行政區的所有資料))
    B -..match+<br>正規表達式 .- C>allData.Add 字串中的行政區].-D>allData.Zone].->B
    D--> J{{renderSelector}}-->F(行政區加入下拉式選單)
    E----K{{displayData}}-->|抓 temporaryData 的第 n 頁呈現的資料|G((curentPageData))
    G---I{{renderList}}
    E-->H{{renderPageList}}
    下拉式選單-->|選單選擇行政區|O{{changeSelect}}-->|之前的資料全部 splice|E
    熱門景點按鈕-->|點擊|P{{callHotSpot}}-->|之前的資料全部 splice|E
    H-->Q[分頁]
    R[英數字頁數]
    S[Previous/<br>Next]
    T[上十頁/<br>下十頁]
    U{{changePage}}
    L{{renderTenPage}}
    V{{activePage}}
    M([currentPage])
    Q-->|點擊|U
    subgraph block
    U-->|判斷 dataset.page 為<br>英數字|R
    U-->|判斷 dataset.page 為<br>pre或nxt|S
    S-->|如果 currentPage 不是 1/<br>不是 10 的倍數/<br>不是 10n+1/<br>不是最後一頁|N>currentPage+/-1]
    S-->|是10的倍數或是10n+1|N & L
    U-->|判斷 dataset.page 為<br>pre10 或 nxt10|T
    T-->L
    L-->W>currentPage 直接變上或下十頁的<br>第一或最後的頁數]
    end
    R-->M
    N-->M
    W-->M
    M-->V
    K-..-M
```

## 遇到的困難與挑戰，以及未來可以改進的項目
1. ### callHotspot() 和 changeSelector() 共同用來渲染的程式碼片段抽離成 renderList 函式
在"first commit"時，callHotspot() 、 changeSelector() 和 renderList() 函式，裡面都同樣有這段程式碼
```js
let str=``
for(let i=0;i<=data.length;i++){
    if(dataZone==data[i].Zone){
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
    }
    UL.innerHTML=str
}
```
後來經高人指點，把這段程式碼抽離出來成一個函式 renderList()，再讓 callHotspot() 和 changeSelector() 裡面去執行，會比較簡潔。<br>
但 callHotspot() 和 changeSelector() 都要在 for 迴圈內判斷每一筆資料是否符合行政區，再加入到str，在這裡卡很久。<br>
直到某一天想出一個辦法：宣告一個全域變數 temporaryData=[]，先讓 callHotspot() 和 changeSelector() 跑 for 迴圈篩出的資料 push 到 temporaryData，
再讓 renderList() 把temporaryData 的資料全部渲染到頁面。(這時還沒有做分頁系統，不是渲染currentPageData)<br>

2. ### 製作分頁功能
+ 2-1   renderPageList()、changePage() 和 renderTenPage() 裡的區域變數有很許多是相同的。<br>
我觀察其他也有做分頁功能的code，是把跟分頁有關的函式都包在一個函式 pagenation()，並在裡面宣告共同會用到的變數。<br>
當我也嘗試這麼做時，發現沒辦法把 pagenation() 裡的函式單獨抓出來執行。不確定是為什麼(我之後再請教高人)，所以最後我還是把它們分出三個函式。
+ 2-2   renderPageList() 和 renderTenPage() 原本想把共同的程式碼
```js
for(let i=;i<=;i++){
    str+=`<li data-page="${i}" class="">${i}</li>`
}
Page.innerHTML=`${pre}${str}${nxt}`
```
放在其中一個函式，讓程式碼看起來更簡潔。但因為要判斷if的狀況實在是太多了！每一種情況的 for 迴圈的頭尾(i)都不一樣(因為頁數會變)，最後str+=這段還是會一直重複被寫。
與其放在其中一個函式去 for 迴圈，讓這個函式變得超冗長，不如最後還是分兩個函式，專注在各自需要用到的情境就好。但也許之後會學到任何可以突破這個問題的技術。

3. ### 未來可以修正的項目
+ 3-1   目前分頁功能的程式碼的if判斷有點太囉嗦太冗長，很難一口氣看得懂。<br>
    之後若有時間改進，會在依照自己做的程式撰寫邏輯再寫得更精簡。
+ 3-2   由於分頁功能設計是最多呈現前10頁(資料超過10頁的話)。但若客戶或UI設計希望可以呈現7個頁數或其他頁數，在if判斷何時 pagelist 要渲染成下 n 頁，
就會變得不好修改。<br>以目前的程式碼邏輯，是以10的倍數的餘數去判斷是否跳下10頁。
+ 3-3   分頁功能也可以嘗試做成：按到偏後面的頁數時，例如9頁中的第7頁，讓"7"這個數字和 active 樣式移到整個 pagelist 的中間，變成：3..."7"...11。

## 參考資料
排版設計來自 六角學院線上課程
