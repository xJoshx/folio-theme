(ns fixture.core)

(defn active-names [users]
  (->> users
       (filter :active)
       (map :name)
       (map clojure.string/upper-case)))
