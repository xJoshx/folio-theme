import SwiftUI

struct ContentView: View {
    @State private var enabled = true

    var body: some View {
        Toggle("SwiftUI", isOn: $enabled).toggleStyle(.switch).padding()
    }
}
