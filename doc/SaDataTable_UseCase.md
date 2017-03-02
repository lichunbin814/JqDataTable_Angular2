# JqueryDataTable

## 現有專案的修改方式

由於專案有多種Jquery DataTables的使用方式，因此將整合為新版本，修改方式如下

### 移除Html用不到的事件

需修改的部份如下：
- 移除(InitComplated)的事件
    - InitComplated為原本在記錄目前使用到的DataTable，現在已改用Angular Component的方式做挷定，需在相對應的Component.ts加入以下語法：
	 	-  @ViewChild(DatatableComponent) dataTable: DatatableComponent;
		 -  DatatableComponent為型別，它會去Html尋找標籤名稱為sa-datatable的物件（因為DatatableComponent所指定的selector為'sa-datatable')

##### datatable.component.ts

``` js
@Component({
  selector: 'sa-datatable'
})
export class DatatableComponent {
	...
}
```

--

##### xxx.component.html（原本）

``` html
<sa-datatable 
   tableClass="table table-striped table-hover table-bordered"
   id="resultTable" 
   #resultTable 
   (InitComplated)="initComplated($event)" >
</sa-datatable>
```
##### xxx.component.ts（原本）

``` js
@Component({
	...
})
export XXXComponent{

	dataTable: any;

	constructor(){
		let self = this;

		$(this.ref.nativeElement).on('click', '.delete-button', function () {
			var $tr = $(this).closest('td').parents('tr');
			var data: any = self.dataTable.row($tr).data();

			...執行刪除功能
		})
	}

	initComplated(_dataTable) {
        this.dataTable = _dataTable;
    }
}
```

--
--

##### xxx.component.html（修改後）

 - 移除 (InitComplated)="initComplated($event)"

``` html
<sa-datatable
   tableClass="table table-striped table-hover table-bordered"
   id="resultTable" 
   #resultTable >
</sa-datatable>
```

xxx.component.ts（修改後）

- 移除initComplated方法
	-  改用ViewChild
	- 若要取得改為ViewChild所挷定的DataTable則需要使用`DataTable.target`;

> DataTable.target為自訂物件，並非Angular的ViewChild的使用方式

``` js
@Component({
	...
})
export XXXComponent{
	
	// 移除 dataTable: any;
	// 改用 ViewChild
	@ViewChild(DatatableComponent) dataTable: DatatableComponent;

	constructor(){		
		let self = this;

		$(this.ref.nativeElement).on('click', '.delete-button', function () {
            var $tr = $(this).closest('td').parents('tr');

			// 移除  self.dataTable.row...
			// 改為 self.dataTable.target.row....
            var data: any = self.dataTable.target.row($tr).data();

            ...執行刪除功能
        })
	}

	(移除)
	// initComplated(_dataTable) {
	//    this.dataTable = _dataTable;
	// }
}
```

### 修改原本的設定檔

xxx.component.ts（原本）

``` js
@Component({
	...
})
export XXXComponent{
	
	 getOptions(myUrl: string = '') {
        let url = this.router.url;
        return {
            serverSide: false,
            processing: true,
            ajax: {
                url: myUrl == '' ? "assets/api/announcement/announcements.json" : myUrl,
                type: 'GET',
                dataSrc: function (d) {
                    return d.data; // return JSON string
                }.bind(this)
            },
            filter: false,
            paginationLength: true,
            lengthMenu: [[10, 25, 100, -1], [10, 25, 100, "All"]],
            order: [[1, "desc"]],
            columnDefs: [
                {
                    targets: 0,
                    data: "id",
                    orderable: false,
                    width: '130px',
                    render: function (data, type, full, meta) {
                        return `<button class="btn btn-default edit-button fa fa-edit">編輯</button>
                                <button class="btn btn-danger delete-button fa fa-trash-o">刪除</button>`;
                    }.bind(this)
                },
				{                
					'targets': 1,
					data: 'startRow',
				},
				{
					'targets': 2,
					'data': 'ClientType'
				}, 
				{
					'targets': 3,
					'data': 'IsOnTop',
				}
				]
        }
}
```

--

xxx.component.ts（修改後）

以下的範例會以撈取此API來做說明：
- {{url}}/api/MyUserInfo/Get/

API回傳的結果：
``` js
 {
	"StartDate" : '2017/03/02',
	"EndDate" : '2017/05/05',
	"IsOnTop" : true,

 }
 ```

修正如下： 
- 移除已整合至DataTable內的參數：
	- serverSide
	- processing
	- ajax
		- url (已整合至ajax的systemName裡)
		- type
		- dataSrc
	 - filter
     - paginationLength
     - lengthMenu
- 增加整合後的DataTable參數
	-  ajax
		- systemName		 
		- searchData
	- columnDefs（將之前的設定整個搬過來）
		- 微調每個欄位的要顯示的方式（可參考render方法）

``` js
@Component({
	...
})
export XXXComponent{

	getOptions() {

        let config: MappDataTables.Settings<any> = {
            ajax: {
				// 依照你要使用的API系統名稱去填寫
                systemName: 'MyUserInfo',
				// 若有需要篩選條件需傳入物件，反之空物件即可
                searchData: () => {
                    return {};
                },
            },
			// 要以第幾個欄位做排序（index由0開始，建議找有指定data的欄位）
            order: [[2, 'desc']],
            columnDefs:
            [{
				// 排序的順序
                targets: 0,
				// 自訂欄位不需指定要使用data的哪個屬性
                data: '',
				// 是否提供排序功能
                orderable: false,
				// 自訂回傳的HTML
                render: (data, type, row, meta) => {
					// 自訂要回傳的HTML
                    let editButtonHtml = this.dataTable.getElementHtml({ elementType: MappDataTables.ElementType.editButton });
                    let deleteButtonHtml = this.dataTable.getElementHtml({ elementType: MappDataTables.ElementType.deleteButton });
                    return editButtonHtml + deleteButtonHtml;
                },
                width: '130px',
            },
            {                
                'targets': 1,
            	data: '',
				// 自訂要回傳的字串
                render: (data, type, row, meta) => {
					// 輸出 => 2017/03/02 ~ 2017/05/05
                    return `${row.StartDate} ~ ${row.EndDate}`;
                },
            },
            {
                // 平台
                'targets': 2,
                'data': 'ClientType'
            }, 
			{
                'targets': 3,
                'data': 'IsOnTop',
                render: (data, type, row, meta) => {
					// 輸出 => 是
                    return row.IsOnTop == 'true' ? '是' : '否';
                },
            }
            ],
        };

        return config;

    }
}
```