import {
  Component,
  ElementRef,
  OnInit,
  Input
} from '@angular/core';





@Component({
  selector: 'app-jq-datatable',
  template: `
<table id="example" class="display" cellspacing="0" width="100%">
    <ng-content></ng-content>
</table>
`,
})
export class JqueryDatatableComponent implements OnInit {

  @Input() public options;

  constructor(private el: ElementRef) {

  }

  ngOnInit() {
    Promise.all([
      System.import('script-loader!assets/jquery-datatables/scripts/jquery.dataTables.min.js'),
    ]).then(() => {
      // 初始化DataTable
      const element = $(this.el.nativeElement.children[0]);

      element.DataTable(this.options);
    });
  }
}