import {
  Component,
  ElementRef,
  OnInit
} from '@angular/core';



declare var $: any;
declare var System: any;

@Component({
  selector: 'app-jq-datatable',
  template: `
<table id="example" class="display" cellspacing="0" width="100%">
    <ng-content></ng-content>
</table>
`,
})
export class JqueryDatatableComponent implements OnInit {

  constructor(private el: ElementRef) {

  }

  ngOnInit() {
    Promise.all([
      System.import('script-loader!assets/jquery-datatables/scripts/jquery.dataTables.min.js'),
    ]).then(() => {
      // 初始化DataTable
      const element = $(this.el.nativeElement.children[0]);

      element.DataTable({
        'processing': true,
        'serverSide': true,
        'ajax': {
          'url': '/api/post.php',
          'type': 'POST'
        },
        'columns': [
          {
            'data': '',
            'render': function (data, type, row) {
              return '<button class="row-btn">我是按鈕</button>';
            },
          },
          { 'data': 'first_name', },
          { 'data': 'last_name' },
          { 'data': 'position' },
          { 'data': 'office' },
          { 'data': 'start_date' },
          { 'data': 'salary' }
        ],
        'createdRow': function (row, data, index) {
          $(row).on('click', '.row-btn', function () {
            alert(data.first_name + ' 已點擊(Angular2)');
          });
        }
      });
    });
  }
}