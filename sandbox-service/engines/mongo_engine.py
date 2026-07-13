"""MongoDB sandbox adapter. Returns documents + .explain("executionStats") output.
Blocks $where and admin commands; caps aggregation pipeline stages."""
