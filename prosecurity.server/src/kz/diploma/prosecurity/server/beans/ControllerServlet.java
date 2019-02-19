package kz.diploma.prosecurity.server.beans;

import kz.greetgo.depinject.core.Bean;
import kz.greetgo.depinject.core.BeanGetter;
import kz.greetgo.mvc.builder.ExecDefinition;
import kz.greetgo.mvc.interfaces.Views;
import kz.greetgo.mvc.model.UploadInfo;
import kz.greetgo.mvc.war.AppServlet;
import kz.diploma.prosecurity.controller.util.Controller;

import java.util.ArrayList;
import java.util.List;

import static java.util.Collections.unmodifiableList;

@Bean
public class ControllerServlet extends AppServlet {
  public BeanGetter<List<Controller>> controllerList;

  @Override
  protected List<Object> getControllerList() {
    return unmodifiableList(new ArrayList<Object>(controllerList.get()));
  }

  public BeanGetter<Views> views;

  @Override
  protected Views getViews() {
    return views.get();
  }

  @Override
  protected UploadInfo getUploadInfo() {
    final UploadInfo ret = new UploadInfo();
    ret.maxFileSize = 50_000_000;
    ret.fileSizeThreshold = 1_000;
    return ret;
  }

  @Override
  protected void afterRegister() {

    System.err.println("[ControllerServlet] --------------------------------------");
    System.err.println("[ControllerServlet] -- USING CONTROLLERS:");
    for (ExecDefinition ed : execDefinitionList()) {
      System.err.println("[ControllerServlet] --   " + ed.infoStr());
    }
    System.err.println("[ControllerServlet] --------------------------------------");

    super.afterRegister();
  }

  @Override
  protected String getTargetSubContext() {
    return "/api";
  }
}
