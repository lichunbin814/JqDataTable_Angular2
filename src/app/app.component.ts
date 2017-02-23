import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  jqDataTableOptions;

  ngOnInit() {
    this.jqDataTableOptions = {
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
    };
  }
}
