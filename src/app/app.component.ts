import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TableVirtualScrollDataSource } from './directives/table-data-source';
// import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'mat-table-virtual-scroll-issue';
  columnNames: any[] = [];
  tableRowsSource = new TableVirtualScrollDataSource();
  dataRows = [];
  navItems: any[] = [];

  bufferMultiplier = 0;
  rowCount = 1300;
  columnCount = 20;
  navCount = 20;

  colorClasses = ['cell-color-red', 'cell-color-green', 'cell-color-blue'];

  constructor(private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.getNewTableRowAndColumns();
  }

  getNewTableRowAndColumns(): void {
    this.navItems = [...Array(this.navCount).keys()].map((value: any, index: any) => {
      return 'Nav Item loooooooooooooooooooooooooooooooooooooog' + (index + 1);
    });

    this.columnNames = [...Array(this.columnCount).keys()].map((value: any, index: any) => {
      return 'Column' + index;
    });
    this.columnNames.unshift('entity');

    this.dataRows = [...Array(this.rowCount).keys()].map((value, index) => {
      const row = {};
      this.columnNames.forEach((column: any) => {
        if (column === 'entity') {
          row[column] = {
            value: `Row ${index}`,
            cellClass: ''
          };
        } else {
          row[column] = {
            value: Math.floor((Math.random() * 100)),
            cellClass: this.colorClasses[(Math.ceil((Math.random() * 300) / 100)) - 1]
          };
        }
      });
      return row;
    });

    this.tableRowsSource.data = this.dataRows;
    this.cdr.detectChanges();
  }
}
