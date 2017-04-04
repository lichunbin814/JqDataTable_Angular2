# CrudService

- CRUD是由以下四種系統內常見的功能所組成
    - **C**reate
    - **R**ead
    - **U**pdate
    - **D**elete

> 一定要先做完[前置動作](#api格式)，CRUD的任一功能才能正常運作！

# API格式

| 功能 	| URL                                      	| 
| ---- | ---- |
| 查詢 	| {baseUrl}/api/**{系統名稱}**/get/             	|
| 查詢  	| {baseUrl}/api/**{系統名稱}**/get/**{ID}**             	|
| 新增 	| {baseUrl}/api/**{系統名稱}**/create          	| 
| 修改 	| {baseUrl}/api/**{系統名稱}**/update/**{ID}** 	| 
| 刪除 	| {baseUrl}/api/**{系統名稱}**/delete/**{ID}** 	| 
| 刪除 	| {baseUrl}/api/**{系統名稱}**/delete/ 	| 

---

> 目前後台的API大同小異，差別在於「系統名稱」及「查詢的ID」，相同的邏輯以被整合至Service，至於有差異的地方，就需要你幫忙，告訴Service，想呼叫哪個「系統名稱」的API。

## 現有專案的修改方式

由於專案內有多種CRUD的使用方式，目前也已整合為一隻Service，來做為後續系統CRUD的使用方式。


## 前置動作

**無論你要使用CRUD中的哪一項功能，皆必須要先「建立設定檔 」!**

### 建立設定檔

剛剛有提到API格式大致都相同，最主要只差異在「系統名稱」及「查詢的ID」，假如我們要向某個API取得資訊時： 
 - API路徑： myApi.com/api/MyUserInfo  
  - baseUrl : myApi.com  
  - 系統名稱 : MyUserInfo
  
並預期會得到以下的結果：

###### 回傳的JSON

``` js
{
  ID : 1,
  Name : 'John',
  Position : 'Taiwan'
}
```

--

可以先依照API回傳的結果在Angular2專案中建立ViewModel，等等在初始化設定檔時會用到

###### my-user-info.ts

``` js
export class MyUserInfo {
    /** 主索引鍵  */
    ID: string;
    /** 姓名  */
    Name: string;
    /** 位置 */
    Position: string;
    /** 編號 */
    CodeNo: string;
}
```


### 初始化CrudService

- 當你開啟component後，只要完成以下步驟，即可完成初始化
    1. 在建構式(constructor)中加入CrudToolService的宣告並在後方指定ViewModel，並設定以下幾個參數，用途請參考範例上的註解
        - systemName
        - dataKey
            - display
            - identifier
       
#### 1.建立設定檔並初始化

###### my-user-info.component.ts

``` js
...
import { MyUserInfo } from './my-user-info';
import { CrudToolSerivce } from 'app/shared/tools/crudtool.service';

@Component({
    ....
})
export class MyUserInfoComponent implements OnInit { 
    constructor(
        private crudForMyUserInfo : CrudToolSerivce<MyUserInfo>
    ) {
    }

    ngOnInit() {
        /**
    * Crud共用設定檔
    */
    let curdSetting : CrudTool.BaseSetting {
        // 組成URL的重要參數(CRUD皆會使用）
        systemName: 'MyUserInfo',
        dataKey: {
           // 要顯示訊息的欄位名稱 
           // (以Delete為例，假如格式為：「{Name}你是否要刪除資料？」，就會由Json資料產生：「John你是否要刪除資料？」的訊息，可參考下方示意圖）
           display: 'Name',
            // 資料單一主鍵的欄位名稱 （Update,Delete 會使用到)
            // 此例使用JSON資料回傳的ID欄位，名稱可依API需求更改為其它名稱
            //  修改 => {baseUrl}/api/MyUserInfo/update/{ID}
            //  刪除 => {baseUrl}/api/MyUserInfo/delete/{ID}
           identifier: 'ID',
            // 若API需使用複合鍵，則需將欄位名稱設定至此欄位（目前僅讓Delete能使用，若Update也需要再跟我說）
            // 註：未整合至 identifier欄位的原因在於，API有可能存在Update使用「單一主鍵」而Delete使用「複合主鍵」
           mutipleIdentifier: ['CodeNo', 'ID']

        },
    }

    this.crudForMyUserInfo.init(curdSetting);
    }
}

```

Delete示意圖：

![Delete示意圖](./step/assets/sweet_alert_delete.png)


## 開始使用

### Read

透過共用設定檔向特定的URL，取得資料:
 - 格式：{baseUrl}/api/**{curdSetting.SystemName}**/get/*id*
 - 實際：myApi.com/api/MyUserInfo/get/*id*
 
> ID非必填，若有要查特定資料在傳入即可, 詳細格式可參考最上方API格式裡的「查詢」
 
``` js
this.crudService.get(this.id).subscribe(data => {
    // 處理資料...
});
```

### Create

透過共用設定檔向特定的URL，新增資料:
 - 格式： {baseUrl}/api/**{curdSetting.SystemName}**/create 
 - 實際：myApi.com/api/MyUserInfo/create

> 也可以使用merge方法，完成Create及Update的功能

``` js
this.crudService.create({
   data: {
       Name : 'SomeOne'
   }
});
```

### Update

透過共用設定檔向特定的URL，更新資料:
- 格式：{baseUrl}/api/**{curdSetting.SystemName}**/update/**{curdSetting.identifier}**
- 實際：myApi.com/api/MyUserInfo/update/1
 - 更新JSON資料中ID為1，Name為John的資料
 
> 也可以使用merge方法，完成Create及Update的功能

``` js
this.crudService.update({
   data: {
       ID : 1
       Name : 'John',
       Position : 'kaohsiung'       
   }
});
```

### Merge

透過指定的Action，决定要將「新增」或「更新」資料

#### 需要新增的資料
假如我們要新增一個SomeOne的資料，而他的主鍵（ID）為「0」或「未設定」，Merge方法判斷主鍵「沒有大於0」或「無法取得」，則會使用「新增（Create)」

```js
this.crudService.merge({
    data: {
      ID : 0,
      Name : "SomeOne"
    }
});
```
#### 需要更新的資料
假如我們要把John的所在地點改為「kaohsiung」，就可以將他的主鍵（ID）放置資料中，Merge方法判斷主鍵大於0，則會使用「更新（Update)」
```js
this.crudService.merge({
    data: {
      ID : 1,
      Name : "John",
      Position : 'kaohsiung'
    }
});
```

#### 說明
``` js
/**
 * 依照主鍵的狀態决定要「新增」或「修改」    
 * 若主鍵為整數 -> 
 * 
 *      新增 ： 小於等於0
 *      修改 ： 大於0    
 * 若主鍵為字串-> 
 * 
 *      新增 ： 字串長度小於等於0
 *      修改 ： 大於0
 */
this.crudService.merge({
    // （非必要）可以在此自訂邏輯，依照頁面的客製需求來决定呼叫的方法
    action: this.isAdd ? CrudTool.action.create : CrudTool.action.update,
    // 要「新增」或「更新」的資料
    data: mergeData
});
```

### Delete

#### 要刪除的資料

下述的Delete API，將用此資料做為範例

``` js
let deleteData = {
    ID : 1,
    Name: 'John',
    Position: 'kh',
    CodeNo: 'a1'
};
``` 

#### 單一主鍵的使用方式

透過共用設定檔向特定的URL，刪除資料:
- 格式：{baseUrl}/api/**{curdSetting.SystemName}**/delete/**{curdSetting.identifier}**
- 實際：myApi.com/api/MyUserInfo/delete/1
    - 刪除資料中ID為1，也就是Name為John的資料
  
##### delete方法運作過程：
 * 找到delteData中 **{curdSetting.identifier}**（ID）的資料。
    * 取得結果：ID為1
 * 串成指定的URL格式=> {baseUrl}/api/**{curdSetting.SystemName}**/delete/1 
 * 呼叫API的Delete方法
 * 註：所以只要你傳入的資料主鍵值是正確的都能刪除，其它欄位不會影響，例如Name是Kevin，但ID還是1，也是能夠正確的刪除資料，因為實際上只會去取得ID，來串成要呼叫Delete方法的URL而己。

##### 使用方式（單一主鍵）

``` js

crudToolService.delete({
    data : deleteData ,
    // 非必填，預設為original，可以使用sweetAlert (CrudTool.DisplayMode.sweetAlert）
    displayMode: CrudTool.DisplayMode.original,
    // 成功之後要跳出的訊息
    success: {
            msg: {
                // 呈現資料的方式
                dipslayMode: CrudTool.DisplayMode.sweetAlert
            },
            after: (param, base) => {
                // 自行實作，該頁面刪除完成要做的事情(例：隱藏特定的區塊）		
            }
    }
});
```

#### 複合主鍵的使用方式



透過共用設定檔向特定的URL，刪除資料:
- 格式：{baseUrl}/api/**{curdSetting.SystemName}**/delete/

##### delete方法運作過程：
    與單一主鍵大致相同，差別在於主鍵不放在URL裡，而是放置於送出的Header中

 * 找到delteData中 **{curdSetting.mutipleIdentifier}**（ID,CodeNo）的複合主鍵資料。
    * 取得結果：ID為1，CodeNo為a1
 * 串成指定的URL格式=> {baseUrl}/api/**{curdSetting.SystemName}**/delete/
 * 將複合主鍵的資料放置Header中的Body，以Object的格式送出
    ``` js
    {
        ID : 1 ,
        CodeNo : 'a1'
    }
    ```
 * 呼叫API的Delete方法
 * 註： 與單一主鍵一樣，關鍵在於主鍵的資料，其餘的資料若與資料庫內的不相同，還是能刪除，所以你傳入的資料**ID必須為1**，**且CodeNo必為a1**，其餘資料不影響刪除結果。

##### 使用方式（複合主鍵）

``` js
crudToolService.delete({   
    /** 所需參數，與「單一主鍵」相同 */
});
```