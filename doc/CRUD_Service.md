# API格式

| 功能 	| URL                                      	| 
| ---- | ---- |
| 查詢 	| {baseUrl}/api/**{系統名稱}**/get/             	|
| 查詢  	| {baseUrl}/api/**{系統名稱}**/get/**{ID}**             	|
| 新增 	| {baseUrl}/api/**{系統名稱}**/create          	| 
| 修改 	| {baseUrl}/api/**{系統名稱}**/update/**{ID}** 	| 
| 刪除 	| {baseUrl}/api/**{系統名稱}**/delete/**{ID}** 	| 

---


## 初始化CRUD共用的Service
依照上面的格式，假如我們要向某個API取得資訊時，會用以下的方式： 
 - API路徑： myApi.com/api/MyUserInfo  
  - baseUrl : myApi.com  
  - 系統名稱 : MyUserInfo
  
###### 回傳的JSON
預期回得到的結果

``` js
{
  ID : 1,
  Name : 'John',
  Position : 'Taiwan'
}
```

#### 初始化的方式
``` js
constructor(
	private crudService: CrudToolSerivce<ChannelNineDetail>
) {
}

ngOnInit() {
	/**
 * Crud共用設定檔 - 通路別九宮格設定-功能性群組設定
 */
export let curdSetting : CrudTool.BaseSetting {
	// 組成URL的重要參數(CRUD皆會使用）
    systemName: 'MyUserInfo',
    dataKey: {
        // 要顯示訊息的欄位名稱 
        // (以Delete為例，假如格式為：「{Name}你是否要刪除資料？」，就會由Json資料產生：「John你是否要刪除資料？」的訊息）
        display: 'Name',
        // 資料索引鍵的欄位名稱 （Update,Delete 會使用到)
        // 此例使用JSON資料回傳的ID欄位，名稱可改成JSON中的其它欄位
        identifier: 'ID'
    },
  }

  this.crudForChannedlNineDetail.init(ChannelNineDetailCrudSetting);
}
```

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
   data: : {
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

透過共用設定檔向特定的URL，刪除資料:
- 格式：{baseUrl}/api/**{curdSetting.SystemName}**/delete/**{curdSetting.identifier}**
- 實際：myApi.com/api/MyUserInfo/delete/1
  - 刪除JSON資料中ID為1，也就是Name為John的資料

``` js
crudToolService.delete({
	data: : {
    ID : 1
  },
    // 非必填，預設為original，可以使用sweetAlert (CrudTool.DisplayMode.sweetAlert）
	displayMode: CrudTool.DisplayMode.original,
    // 成功之後要跳出的訊息
	success: {
		msg: {
        	// 呈現資料的方式
			dipslayMode: CrudTool.DisplayMode.sweetAlert
		},
		after: (param, base) => {
			// 刪除完成要做的事情(例：隱藏特定的區塊）			
		}
	}
});
```
