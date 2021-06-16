package Cache;

use warnings;
use strict;
use FindBin qw( $RealBin );

sub get_expire
{
    my $expire = `cat '$RealBin/../conf/cache-expire'`;
    return  $expire;
}

sub get_refresh
{
    my $refresh = `cat '$RealBin/../conf/cache-refresh'`;
    return  $refresh;
}


sub refresh
{
    my ( $refresh_time ) = @_;
    system "echo -n '$refresh_time' > '$RealBin/../conf/cache-refresh'";
    return  0;
}

1;
