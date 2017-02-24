# API格式

| 功能 	| URL                                      	| 
| -- | -- |
| 查詢 	| {baseUrl}/api/**{系統名稱}**/get/             	|
| 查詢  	| {baseUrl}/api/**{系統名稱}**/get/**{ID}**             	|
| 新增 	| {baseUrl}/api/**{系統名稱}**/create          	| 
| 修改 	| {baseUrl}/api/**{系統名稱}**/update/**{ID}** 	| 
| 刪除 	| {baseUrl}/api/**{系統名稱}**/delete/**{ID}** 	| 

---


## 初始化CRUD共用的Service



``` js
constructor(
	private crudService: CrudToolSerivce<ChannelNineDetail>
) {
}

ngOnInit() {
	/**
 * Crud共用設定檔 - 通路別九宮格設定-功能性群組設定
 */
export let curdSetting : CrudTool.BaseSetting = {
	// 組成URL的重要參數(CRUD皆會使用）
    systemName: 'XXX',
    dataKey: {
        // 要顯示訊息的欄位名稱
        display: 'XXX',
        // 資料索引鍵的欄位名稱 （Update,Delete 會使用到)
        identifier: 'XXX'
    },
  }

  this.crudForChannedlNineDetail.init(ChannelNineDetailCrudSetting);
}
```

### Read

透過共用設定檔向特定的URL，取得資料:
 - {baseUrl}/api/**{curdSetting.SystemName}**/get/*id*

> ID非必填，若有要查特定資料在傳入即可

``` js
this.crudService.get(this.id).subscribe(data => {
    // 處理資料...
});
```

### Create

透過共用設定檔向特定的URL，新增資料:
 - {baseUrl}/api/**{curdSetting.SystemName}**/create 

> 也可以使用merge方法，完成Create及Update的功能

``` js
this.crudService.create({
   data: createData
});
```

### Update

透過共用設定檔向特定的URL，更新資料:
- {baseUrl}/api/**{curdSetting.SystemName}**/update/**{curdSetting.identifier}**

> 也可以使用merge方法，完成Create及Update的功能

``` js
this.crudService.update({
   data: updateData
});
```

### Merge

透過指定的Action，决定要將「新增」或「更新」資料

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
	data: mergeData
});
```

### Delete

透過共用設定檔向特定的URL，刪除資料:
- {baseUrl}/api/**{curdSetting.SystemName}**/delete/**{curdSetting.identifier}**

``` js
crudToolService.delete({
	data: deleteData,
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