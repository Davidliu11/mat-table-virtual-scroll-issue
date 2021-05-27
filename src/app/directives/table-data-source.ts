import { BehaviorSubject, combineLatest, merge, Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export class TableVirtualScrollDataSource<T> extends MatTableDataSource<T> {
  public dataToRender$: Subject<T[]>;
  public dataOfRange$: Subject<T[]>;
  private streamsReady: boolean;

  _updateChangeSubscription() {
    this.initStreams();
    const nameData = '_data';
    const nameSort = '_sort';
    const namePaginator = '_paginator';
    const nameInternalPageChanges = '_internalPageChanges';
    const nameFilter = '_filter';
    const nameRenderData = '_renderData';
    const _sort: MatSort | undefined = this[nameSort];
    const _paginator: MatPaginator | undefined = this[namePaginator];
    const _internalPageChanges: Subject<void> = this[nameInternalPageChanges];
    const _filter: BehaviorSubject<string> = this[nameFilter];
    const _renderData: BehaviorSubject<T[]> = this[nameRenderData];

    const sortChange: Observable<Sort | undefined | void> = _sort ?
      merge(_sort.sortChange, _sort.initialized) as Observable<Sort | void> :
      of(undefined);
    const pageChange: Observable<PageEvent | undefined | void> = _paginator ?
      merge(
        _paginator.page,
        _internalPageChanges,
        _paginator.initialized
      ) as Observable<PageEvent | void> :
      of(undefined);
    const dataStream: Observable<T[]> = this[nameData];
    const filteredData = combineLatest([dataStream, _filter])
      .pipe(map(([data]) => this._filterData(data)));
    const orderedData = combineLatest([filteredData, sortChange])
      .pipe(map(([data]) => this._orderData(data)));
    const paginatedData = combineLatest([orderedData, pageChange])
      .pipe(map(([data]) => this._pageData(data)));

    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = new Subscription();
    this._renderChangesSubscription.add(
      paginatedData.subscribe(data => this.dataToRender$.next(data))
    );
    this._renderChangesSubscription.add(
      this.dataOfRange$.subscribe(data => _renderData.next(data))
    );
  }

  private initStreams() {
    if (!this.streamsReady) {
      this.dataToRender$ = new ReplaySubject<T[]>(1);
      this.dataOfRange$ = new ReplaySubject<T[]>(1);
      this.streamsReady = true;
    }
  }
}