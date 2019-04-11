export class ChildEvents {
  public fio: string;
  public events: Event[];

  public static of(a: any): ChildEvents {
    const ret = new ChildEvents();
    ret.assign(a);
    return ret;
  }

  assign(a: any) {
    this.fio = a.fio;
    // noinspection SuspiciousInstanceOfGuard
    this.events = (a.events instanceof Array) ? a.events.map(c => c) : [];
  }
}