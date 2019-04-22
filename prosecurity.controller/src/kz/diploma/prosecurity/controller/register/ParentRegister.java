package kz.diploma.prosecurity.controller.register;

import kz.diploma.prosecurity.controller.model.ToSave;

public interface ParentRegister {
  public long register(ToSave toSave);
  public ToSave getInfo(long id);
  public void updateParent(ToSave toSave);
  public void deleteParent(long id);
}
