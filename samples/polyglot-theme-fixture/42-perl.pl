use strict;
use warnings;

my @names = grep { /active/ } qw(active paused active);
print "Perl: ", join(', ', @names), "\n";
