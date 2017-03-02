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

``` html
<sa-datatable
   tableClass="table table-striped table-hover table-bordered"
   id="resultTable" 
   #resultTable >
</sa-datatable>
```

xxx.component.ts（修改後）

若要取得改為this.

``` js
@Component({
	...
})
export XXXComponent{
	
	~~dataTable: any; ~~
	@ViewChild(DatatableComponent) dataTable: DatatableComponent;

	constructor(){
		        $(this.ref.nativeElement).on('click', '.delete-button', function () {
            var $tr = $(this).closest('td').parents('tr');
			~~var data: any = self.dataTable.row($tr).data();~~
            var data: any = self.dataTable.target.row($tr).data();

            ...執行刪除功能
        })
	}
}
```

