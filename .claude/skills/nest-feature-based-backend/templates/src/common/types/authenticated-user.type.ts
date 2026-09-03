/**
 * Formato de `req.user`, populado pelo JwtStrategy após validar o token.
 * Fica em common/ (não em features/auth/) porque common/decorators/
 * current-user.decorator.ts precisa do tipo sem depender de código de
 * dentro de uma feature.
 */
export interface AuthenticatedUser {
  id: string
  email: string
  role: string
}
