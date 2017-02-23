import {
  Component,
  ElementRef,
  AfterViewInit,
  OnInit
} from '@angular/core';



declare var $: any;
declare var System: any;

@Component({
  selector: 'app-jq-datatable',
  template: `
<table id="example" class="display" cellspacing="0" width="100%">
    <thead>
        <tr>
            <th>編輯</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Position</th>
            <th>Office</th>
            <th>Start date</th>
            <th>Salary</th>
        </tr>
    </thead>
    <tfoot>
        <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Position</th>
            <th>Office</th>
            <th>Start date</th>
            <th>Salary</th>
        </tr>
    </tfoot>
</table>
`,
})
export class JqueryDatatableComponent implements OnInit, AfterViewInit {

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
        ]
      });

      element.on('click', '.row-btn', function () {
        alert('已點擊(Angular2)');
      });
    });
  }

  ngAfterViewInit() {

  };


}