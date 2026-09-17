class MainActivity : AppCompatActivity() {
    override fun onCreate(state: Bundle?) {
        super.onCreate(state)
        setContentView(R.layout.activity_main)
        findViewById<TextView>(R.id.status).text = getString(R.string.ready)
    }
}
