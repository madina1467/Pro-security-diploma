package kz.diploma.prosecurity.register.util;

import java.io.File;

public class App {
  public static String appDir() {
    return System.getProperty("user.home") + "/prosecurity.d";
  }

  public static String securityDir() {
    return appDir() + "/security";
  }

  public static File do_not_run_liquibase_on_deploy_war() {
    return new File(appDir() + "/do_not_run_liquibase_on_deploy_war");
  }
}
