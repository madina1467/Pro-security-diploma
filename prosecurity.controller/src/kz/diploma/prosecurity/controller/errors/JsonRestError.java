package kz.diploma.prosecurity.controller.errors;

/**
 * Ошибка запроса по REST которая ещё отправляет объект через JSON.
 */
public class JsonRestError extends RestError {
  public final Object sendingAsJsonObject;

  public JsonRestError(Object sendingAsJsonObject) {
    super(sendingAsJsonObject == null ? null : sendingAsJsonObject.toString());
    this.sendingAsJsonObject = sendingAsJsonObject;
  }

  public JsonRestError(int statusCode, Object sendingAsJsonObject) {
    super(statusCode, sendingAsJsonObject == null ? null : sendingAsJsonObject.toString());
    this.sendingAsJsonObject = sendingAsJsonObject;
  }
}
