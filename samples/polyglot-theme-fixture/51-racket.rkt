#lang racket

(define (active-names users)
  (map (lambda (user) (hash-ref user 'name))
       (filter (lambda (user) (hash-ref user 'active?)) users)))
