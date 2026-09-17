sealed class State {}
class Ready extends State { final int count; Ready(this.count); }

Future<String> greet(String name) async => 'Hello, $name';
