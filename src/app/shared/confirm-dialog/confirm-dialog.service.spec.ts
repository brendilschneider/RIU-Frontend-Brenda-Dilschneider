import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from './confirm-dialog.service';
import { of } from 'rxjs';

describe('DialogService', () => {
  let service: DialogService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useValue: spy }
      ]
    });

    service = TestBed.inject(DialogService);
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open confirm dialog with correct data and return afterClosed observable', (done) => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    service.openDeleteConfirm('Iron Man').subscribe(result => {
      expect(result).toBeTrue();
      expect(dialogSpy.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          width: '400px',
          disableClose: true,
          data: jasmine.objectContaining({
            title: 'Delete Superhero?',
            message: 'Are you sure you want to delete "Iron Man"? This action cannot be undone.'
          })
        })
      );
      done();
    });
  });
});