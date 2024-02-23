<?php
  $temp_dir=sys_get_temp_dir();
  move_uploaded_file( $_FILES['data']['tmp_name'] , $temp_dir.'/'.htmlspecialchars($_POST['file']) );
?>
