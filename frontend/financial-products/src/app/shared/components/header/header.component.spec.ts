import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

// Mocks simples para posibles dependencias futuras
const mockRouter = {
  navigate: () => {},
  navigateByUrl: () => {},
  url: '/',
  events: [],
  createUrlTree: () => ({}),
  serializeUrl: () => '',
  resetConfig: () => {},
  isActive: () => false,
  getCurrentNavigation: () => null,
  routerState: {},
  config: [],
  errorHandler: () => {},
  dispose: () => {},
  onSameUrlNavigation: 'reload',
  initialNavigation: () => {},
  setUpLocationChangeListener: () => {}
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: (key: string) => null
    },
    data: {},
    url: [],
    queryParams: {},
    fragment: '',
    outlet: 'primary',
    component: null
  },
  params: [],
  data: [],
  queryParams: [],
  fragment: [],
  url: [],
  outlet: 'primary',
  component: null,
  root: {},
  parent: null,
  firstChild: null,
  children: [],
  pathFromRoot: [],
  toString: () => '[ActivatedRouteMock]'
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: 'Router', useValue: mockRouter },
        { provide: 'ActivatedRoute', useValue: mockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Test simple de renderizado
  it('debe renderizar el título BANCO', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('BANCO');
  });
}); 