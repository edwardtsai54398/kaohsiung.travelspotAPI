# 高雄景點Open Data串接
使用高雄市政府開放資料，迅速查看各區的主要旅遊景點資訊。<br>
[展示頁面 Display Page](https://edwardtsai54398.github.io/kaohsiung.travelspotAPI/)

---
## 使用技術
* 原生JS 語法
* .match 搭配正規表達式抓出地址字串中的行政區
* AJAX 技術導入json 連結
## 功能介紹
#### * 顯示串接高雄開放資料的旅遊相關資訊，用圖卡列出相關資訊。

#### * 選單可直接選取想要查詢的行政區查詢資料。
<img width="800" alt="截圖 2023-03-12 上午9 47 08" src="https://user-images.githubusercontent.com/118988159/224523794-e06b9ac9-1383-483c-97d1-a85409f3a136.png">

#### * 使用熱門行政區按鈕，可查詢該行政區，且上方選單會一併轉跳。
<img width="800" alt="截圖 2023-03-12 上午9 48 01" src="https://user-images.githubusercontent.com/118988159/224523831-882b66b4-b088-4e50-9cfd-991b00be902a.png">

#### * scroll bar 下滑到一定的位置，右下角會顯現"回到上方"的按鈕。
<img width="500" alt="截圖 2023-03-12 上午9 48 53" src="https://user-images.githubusercontent.com/118988159/224523841-06371d54-e215-466c-a0fc-7c07f7d56e93.png">

#### * 分頁功能
<img width="800" alt="截圖 2023-03-12 上午9 49 25" src="https://user-images.githubusercontent.com/118988159/224523847-c4bf871a-bd1e-4817-9ab0-2ca7c5517006.png">

## 程式撰寫邏輯
```mermaid
flowchart TB
    A[(Open Data json檔)] -->|AJAX| B((allData))
    B ------>|全部push| E((temporaryData<br>該行政區的所有資料))
    B -..match+<br>正規表達式 .- C>allData.Add字串中的行政區].-D>allData.Zone].->B
    D--> J{{renderSelector}}-->F(行政區加入下拉式選單)
    E---->K{{displayData}}-->|抓temporaryData的第n頁呈現的資料|G((curentPageData))
    G-->I{{renderList}}
    E-->H{{renderPageList}}
    M[下拉式選單]-->|選單選擇行政區|O{{changeSelect}}-->|之前的資料全部splice|E
    N[熱門景點按鈕]-->|點擊|P{{callHotSpot}}-->|之前的資料全部splice|E
    H-->Q[分頁]
    R[英數字頁數]
    S[Previous/<br>Next]
    T[上十頁/<br>下十頁]
    U{{changePage}}
    L{{renderTenPage}}
    Q-->R
    Q-->S
    Q-->T
    R-->|點擊|U
```

## 遇到的困難與挑戰，以及未來可以改進的項目

## 參考資料
排版設計來自 六角學院線上課程
