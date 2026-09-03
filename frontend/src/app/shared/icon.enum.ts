/**
 * Nomes de ícones do Material Symbols usados na aplicação.
 *
 * Centraliza as strings de ícone num só lugar — use `Icon.Edit` em vez de
 * `'edit'` solto. Ao precisar de um ícone novo, adicione aqui a entrada
 * correspondente ao nome do Material Symbols.
 *
 * Uso: `<app-button [icon]="Icon.Add" />` ou `<mat-icon>{{ Icon.Add }}</mat-icon>`
 * (exponha `readonly Icon = Icon` no componente para acessar no template).
 */
export enum Icon {
  Add = 'add',
  Edit = 'edit',
  Delete = 'delete',
  Search = 'search',
  Close = 'close',
  Back = 'arrow_back',
  Check = 'check',
  Menu = 'menu',
  Language = 'translate',
  Logout = 'logout',
  Dashboard = 'dashboard',
  Users = 'group',
  Courses = 'school',
  Visibility = 'visibility',
  VisibilityOff = 'visibility_off',
}
