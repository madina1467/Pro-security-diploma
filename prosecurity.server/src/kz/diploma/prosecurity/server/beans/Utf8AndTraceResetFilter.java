package kz.diploma.prosecurity.server.beans;

import kz.greetgo.depinject.core.Bean;
import kz.diploma.prosecurity.controller.logging.LogIdentity;

import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;
import java.util.EnumSet;

@Bean
public class Utf8AndTraceResetFilter implements Filter {
  public void register(ServletContext ctx) {
    FilterRegistration.Dynamic dynamic = ctx.addFilter(getClass().getName(), this);
    dynamic.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, "/*");
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
    throws IOException, ServletException {

    LogIdentity.resetThread();

    request.setCharacterEncoding("UTF-8");
    response.setCharacterEncoding("UTF-8");
    chain.doFilter(request, response);

  }

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {}

  @Override
  public void destroy() {}
}
