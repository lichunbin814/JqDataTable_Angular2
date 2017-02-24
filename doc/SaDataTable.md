# JqueryDataTable

## 查詢方式

透過共用設定檔向特定的URL，取得資料:
- {baseUrl}/api/**{curdSetting.SystemName}**/delete/**{curdSetting.identifier}**

``` js
  let config: MappDataTables.Settings<ChannelNineDetailDtModel> = {
            ajax: {
            	// 系統名稱
                systemName: 'XXX',
                // 非必填：查詢子系統才需要用到
                systemID: 1234,
                // 查詢條件
                searchData: () => {
                    return this.filter;
                },
                // 取得WebApi傳入的資料子集合讓DataTable做顯示
                dataSrc: (result) => {
                    return result.data[0].ChilderData;
                }
            },
  }
```

## 自訂元素

### 自訂HTML

 - ColumnDef 
 	- 會回傳自訂元素
 - rowElementEvents 
 	- 指定自訂元素的Selector(例子中是以Class當作例子），並撰寫觸發Click事件後的邏輯

``` js
let config: MappDataTables.Settings<ChannelNineDetailDtModel> = {        
	columnDefs:
	[{
			targets: 0,
			render: (data, type, row, meta) => {
            	// 取得模版的HTML
                let editButtonHtml = `<button class="edit-btn">編輯</button>`
                
                let deleteButtonHtml =`<button class="delete-btn">刪除</button>`
                
                return editButtonHtml + deleteButtonHtml;
			},
			width: '120px',
		}, 
	],
	rowElementEvents: [
		{
         	// 編輯按鈕的事件(挷定Class為edit-btn的元素）
			selector: '.edit-btn',
			click: (row, data, index) => {
				// 要做的事情
			},
		},
		{
            // 刪除按鈕的事件(挷定Class為delete-btn的元素）
			selector: '.delete-btn',
			click: (row, data, index) => {
				// 要做的事情
			}
		}
	],
};
```

### 使用模版

這是將之前「自訂HTML」以變數的方式做操作

``` js
let config: MappDataTables.Settings<ChannelNineDetailDtModel> = {        
	columnDefs:
	[{
			targets: 0,
			render: (data, type, row, meta) => {
            	// 取得模版的HTML
                let editButtonHtml = this.dataTable.getElementHtml({ 
                   elementType: MappDataTables.ElementType.editButton 
                });
                
                let deleteButtonHtml = this.dataTable.getElementHtml({ 
                    elementType: MappDataTables.ElementType.deleteButton 
                });
                
                return editButtonHtml + deleteButtonHtml;
			},
			width: '120px',
		}, 
	],
	rowElementEvents: [
		{
         	// 編輯按鈕的事件
			selector: MappDataTables.ElementType.editButton,
			click: (row, data, index) => {
				// 要做的事情
			},
		},
		{
            // 刪除按鈕的事件
			selector: MappDataTables.ElementType.deleteButton,
			click: (row, data, index) => {
				// 要做的事情
			}
		}
	],
};
```