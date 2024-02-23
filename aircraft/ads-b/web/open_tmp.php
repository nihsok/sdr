<?php
  $temp_dir=sys_get_temp_dir();
  echo file_get_contents( $temp_dir.'/'.htmlspecialchars($_GET['file']) );
?>
