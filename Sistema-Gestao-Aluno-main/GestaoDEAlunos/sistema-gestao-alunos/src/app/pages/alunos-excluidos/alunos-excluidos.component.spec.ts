import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlunosExcluidosComponent } from './alunos-excluidos.component';

describe('AlunosExcluidos', () => {
  let component: AlunosExcluidosComponent;
  let fixture: ComponentFixture<AlunosExcluidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunosExcluidosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlunosExcluidosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
