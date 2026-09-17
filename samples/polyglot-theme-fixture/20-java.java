import java.util.stream.Stream;

public final class Example {
  public static void main(String[] args) {
    var names = Stream.of("Ada", "Grace").map(String::toUpperCase).toList();
    System.out.println(names);
  }
}
