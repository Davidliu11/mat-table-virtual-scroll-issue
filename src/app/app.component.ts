import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'mat-table-virtual-scroll-issue';
  columnNames: any[] = [];
  tableRows = new TableVirtualScrollDataSource();
  columns = [];
  dataRows = [];

  rowCount = 1;
  columnCount = 1;

  colorClasses = ['cell-color-red', 'cell-color-green', 'cell-color-blue'];

  constructor(private cdr: ChangeDetectorRef) {

  }

  rowChange(value: number): void {
    this.getNewTableRowAndColumns();
  }

  columnsChange(value: number): void {
    this.getNewTableRowAndColumns();
  }

  getNewTableRowAndColumns(): void {
    this.columnNames = [...Array(this.columnCount).keys()].map((value: any, index: any) => {
      return 'Column' + index;
    });

    this.dataRows = [...Array(this.rowCount).keys()].map((value, index) => {
      const row = {};
      this.columnNames.forEach((column: any) => {
        row[column] = {
          value: Math.floor((Math.random() * 100)),
          cellClass: this.colorClasses[(Math.ceil((Math.random() * 300) / 100)) - 1]
        };
      });
      return row;
    });
    this.tableRows.data = this.dataRows;
    this.cdr.detectChanges();
    console.log(this.tableRows.data);
  }
}
