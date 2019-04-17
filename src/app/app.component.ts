import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, Sort, PageEvent } from '@angular/material';
import { debounceTime } from "rxjs/operators";

import { LaunchService, SpaceXApiParams } from "./launch.service";
import { Launch } from "./launch";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title: string = 'SpaceX';
  params = new SpaceXApiParams();
  loading: boolean = false;
  pageSizeOptions: number[] = [10, 25, 50];
  displayedColumns: string[] = ['flight_number', 'launch_year', 'rocket_name', 'details'];
  dataSource = new MatTableDataSource<Launch>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private launchService: LaunchService) { }

  ngOnInit() {
    this.params.limit = this.pageSizeOptions[0];
    this.getLaunches();
    this.getLaunchCount();
  }

  ngAfterViewInit() {
    this.sort.sortChange.pipe(
      debounceTime(600)
    ).subscribe((sort: Sort) => {
      this.sortData(sort);
    });

    this.paginator.page.pipe(
      debounceTime(600)
    ).subscribe((pageEvent: PageEvent) => {
      this.updatePaginator(pageEvent);
    });
  }

  getLaunches() {
    this.loading = true;
    this.launchService.getLaunches(this.params).subscribe(launches => {
      this.dataSource.data = launches;
      this.loading = false;
    })
  }

  getLaunchCount() {
    this.launchService.getLaunchCount().subscribe(count => {
      this.paginator.length = count;
    })
  }

  sortData(sort: Sort) {
    if (sort.active && sort.direction) {
      this.params.sort = sort.active;
      this.params.order = sort.direction;
      this.paginator.pageIndex == 0 ? this.getLaunches() : this.paginator.firstPage();
    }
  }

  updatePaginator(pageEvent: PageEvent) {
    this.params.limit = pageEvent.pageSize;
    this.params.offset = pageEvent.pageIndex * this.params.limit;
    this.getLaunches();
  }

  openPresskit(launch: Launch) {
    if (launch.links.presskit) window.open(launch.links.presskit, '_blank');
  }

}
