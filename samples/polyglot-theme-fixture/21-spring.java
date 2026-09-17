@RestController
@RequestMapping("/api")
class HealthController {
  @GetMapping("/health")
  ResponseEntity<Map<String, Boolean>> health() {
    return ResponseEntity.ok(Map.of("healthy", true));
  }
}
