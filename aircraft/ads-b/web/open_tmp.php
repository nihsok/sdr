<?php
  $filename = htmlspecialchars($_GET['file']);
  header('Content-Type: text/csv');
  header('Content-Disposition: attachment; filename='.$filename);
  readfile( sys_get_temp_dir().'/'.$filename );
?>
