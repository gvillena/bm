import type { Identifier } from './value-objects/identifier.vo.js';

export abstract class BaseEntity<TProps extends object> {
  protected readonly props: TProps;

  protected constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  public abstract get id(): Identifier;

  public equals(entity?: BaseEntity<TProps>): boolean {
    if (!entity) return false;
    if (this === entity) return true;
    return this.id.equals(entity.id);
  }

  protected cloneProps(): TProps {
    return { ...(this.props as Record<string, unknown>) } as TProps;
  }
}
